/* eslint-disable no-undef */
const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const moment = require("moment");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
const CourseProgress = require("../models/CourseProgress");
const {
  convertSecondsToDuration,
} = require("../utils/convertSecondsToDuration");
require("dotenv").config();

// 9

exports.updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", about = "", contactNumber, gender, firstName, lastName } = req.body;
    const id = req.user.id;
    const userDetails = await User.findById(id);

    const profileId = userDetails.additionalData;
    const profileDetails = await Profile.findById(profileId);

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;
    await profileDetails.save();

    // Also update user's first and last name if provided
    if (firstName || lastName) {
      userDetails.firstName = firstName || userDetails.firstName;
      userDetails.lastName = lastName || userDetails.lastName;
      await userDetails.save();
    }

    // const profileDetails = await Profile.findOneAndUpdate(
    //   { _id: userDetails.additionalData },
    //   {
    //     dateOfBirth,
    //     about,
    //     gender,
    //     contactNumber,
    //   },
    //   { new: true }
    // );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
      user: {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Error in updating profile",
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Perform immediate cleanup and deletion of user and related data
    try {
      // 1. Remove user from enrolled students lists in all courses
      await Course.updateMany({ studentsEnrolled: id }, { $pull: { studentsEnrolled: id } });

      // 2. Delete all course progress documents for this user
      await CourseProgress.deleteMany({ userId: id });

      // 3. Delete profile document linked in additionalData (if exists)
      if (userDetails.additionalData) {
        await Profile.findByIdAndDelete(userDetails.additionalData);
      }

      // 4. Finally delete the user document
      await User.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "User and related data deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting user and related data:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to delete user and related data",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Error while scheduling account deletion",
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalData")
      .exec();

    return res.status(200).json({
      success: true,
      data: userDetails,
      message: "User details fetched successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Error in fetching user details",
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadFileToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetailsDoc = await User.findOne({ _id: userId })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    if (!userDetailsDoc) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    // Convert the entire user document to plain JS object
    const userDetails = userDetailsDoc.toObject();
    var SubsectionLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });
    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = course.price * totalStudentsEnrolled;

      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
      return courseDataWithStats;
    });

    return res.status(200).json({
      success: true,
      courses: courseData,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

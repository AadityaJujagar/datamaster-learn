/* eslint-disable no-undef */
const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
const {
  convertSecondsToDuration,
} = require("../utils/convertSecondsToDuration");
require("dotenv").config();

// 6.1

exports.createCourse = async (req, res) => {
  const userId = req.user.id;
  try {
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      status,
    } = req.body;
    const thumbnail = req.files.thumbnailImage;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (!status || status === undefined) {
      // eslint-disable-next-line no-const-assign
      status = "Draft";
    }

    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor not found",
      });
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    const thumbnailImageUpload = await uploadFileToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const course = new Course({
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      thumbnail: thumbnailImageUpload.secure_url,
      category: existingCategory._id,
      instructor: instructorDetails._id,
      status,
    });
    const newCourse = await course.save();

    await User.findOneAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );
    await Category.findOneAndUpdate(
      { _id: existingCategory._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to create course, try again",
    });
  }
};

exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        // ratingandreview: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      data: allCourses,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch courses, try again",
    });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const courseDetailsArr = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: { path: "additionalData" },
      })
      .populate("category")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec();

    if (!courseDetailsArr || courseDetailsArr.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Course not found with id ${courseId}`,
      });
    }
    const courseDetails = courseDetailsArr[0];

    let totalDurationInSeconds = 0;
    courseDetails.courseContent?.forEach((section) => {
      section.subSection?.forEach((sub) => {
        const duration = parseFloat(sub.timeDuration) || 0;
        totalDurationInSeconds += duration;
      });
    });
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      message: "Course details retrieved successfully",
      data: { courseDetails, totalDuration },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch course details, try again",
    });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: `Course not found with id ${courseId}`,
      });
    }

    // Handle thumbnail upload (if any)
    if (req.files && req.files.thumbnailImage) {
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadFileToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      updates.thumbnail = thumbnailImage.secure_url;
    }

    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }
    await course.save();

    // Populate related data
    const updatedCourse = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalData",
        },
      })
      .populate("category")
      // .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (err) {
    console.error("Error while editing course:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to update course, try again",
    });
  }
};

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id; // this will be correctly populated if using auth middleware

    // Fetch course details
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: { path: "additionalData" },
      })
      .populate("category")
      .populate({
        path: "courseContent",
        populate: "subSection",
      })
      .exec();

    // Fetch course progress for the current user
    let courseProgressCount = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Course not found with id ${courseId}`,
      });
    }

    // Check if course is still in "Draft" status
    if (courseDetails.status === "Draft") {
      return res.status(400).json({
        success: false,
        message: `Accessing course in preparation stage is forbidden`,
      });
    }

    // Calculate total duration of the course
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration) || 0;
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    // Convert the total duration from seconds to a readable format
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    // Get the list of completed videos
    const completedVideos = courseProgressCount?.completedVideos || [];

    // Respond with course details, total duration, and completed videos
    return res.status(200).json({
      success: true,
      message: "Course details retrieved successfully",
      data: {
        courseDetails,
        totalDuration,
        completedVideos, // Passed completed videos here
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch course details, try again",
    });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const instructorCourses = await Course.find({ instructor: instructorId })
      .sort({ createdAt: -1 })
      .populate("instructor")
      .populate("category")
      // .populate("ratingAndReviews")
      .exec();

    if (!instructorCourses) {
      return res.status(400).json({
        success: false,
        message: `Instructor not found with id ${instructorId}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Instructor courses retrieved successfully",
      data: instructorCourses,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch instructor courses, try again",
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: `Course not found with id ${courseId}`,
      });
    }

    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await Section.findByIdAndDelete(subSectionId);
        }
      }
      await Section.findByIdAndDelete(sectionId);
    }
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to delete course, try again",
    });
  }
};

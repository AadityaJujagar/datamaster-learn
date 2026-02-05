/* eslint-disable no-undef */
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollment } = require("../mail/templates/courseEnrollment");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");
require("dotenv").config();

exports.capturePayment = async (req, res) => {
  // Payments are currently disabled. Inform client to show "Payment gateway in progress".
  return res.status(503).json({
    success: false,
    message: "Payment gateway in progress",
  });
};

exports.verifyPayment = async (req, res) => {
  // Payments are disabled; verification not available.
  return res.status(503).json({
    success: false,
    message: "Payment gateway in progress",
  });
};

const enrolledStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide data for courses/userId",
    });
  }

  for (const courseId of courses) {
    const enrolledCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $push: { studentsEnrolled: userId } },
      { new: true }
    );

    if (!enrolledCourse) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    const courseProgress = await CourseProgress.create({
      courseID: courseId,
      userId: userId,
      completedVideos: [],
    });

    const enrolledStudent = await User.findByIdAndUpdate(
      userId,
      { $push: { courses: courseId, courseProgress: courseProgress._id } },
      { new: true }
    );

    await mailSender(
      enrolledStudent.email,
      `Successfully Enrolled into ${enrolledCourse.courseName}`,
      courseEnrollment(
        enrolledCourse.courseName,
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
      )
    );
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all data fields",
    });
  }

  try {
    // Payments disabled — inform client
    return res.status(503).json({
      success: false,
      message: "Payment gateway in progress",
    });
  } catch (err) {
    console.error("Error sending payment email:", err);
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
};

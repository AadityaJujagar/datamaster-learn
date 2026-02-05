/* eslint-disable no-undef */
const { instance } = require("../configs/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollment } = require("../mail/templates/courseEnrollment");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");
require("dotenv").config();
const crypto = require("crypto");

exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (!courses || courses.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No courses selected",
    });
  }

  let totalAmount = 0;
  for (const course_id of courses) {
    try {
      const course = await Course.findById(course_id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      if (course.studentsEnrolled.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "You are already enrolled in this course",
        });
      }

      totalAmount += course.price;
    } catch (err) {
      console.error("Error in capturePayment:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    const paymentResponse = await instance.orders.create(options);
    res.json({
      success: true,
      message: paymentResponse,
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create order, try again later",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courses,
  } = req.body;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed - missing data",
    });
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (razorpay_signature === expectedSignature) {
    await enrolledStudents(courses, userId, res);
    return res.status(200).json({
      success: true,
      message: "Payment verified",
    });
  }

  return res.status(400).json({
    success: false,
    message: "Invalid signature",
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
    const enrolledStudent = await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      `Payment received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
    return res.status(200).json({
      success: true,
      message: "Payment success email sent",
    });
  } catch (err) {
    console.error("Error sending payment email:", err);
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
};

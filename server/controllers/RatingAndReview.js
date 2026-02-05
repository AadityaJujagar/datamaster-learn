// /* eslint-disable no-undef */
// const RatingAndReview = require("../models/RatingAndReview");
// const Course = require("../models/Course");
// const mongoose = require("mongoose");

// // 11

// exports.createRating = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { rating, review, courseId } = req.body;
//     const courseDetails = await Course.findOne({
//       _id: courseId,
//       studentsEnrolled: { $elemMatch: { $eq: userId } },
//     });
//     if (!courseDetails) {
//       return res.status(400).json({
//         success: false,
//         message: "Course not found",
//       });
//     }

//     const alreadyReviewed = await RatingAndReview.findOne({
//       user: userId,
//       course: courseId,
//     });
//     if (alreadyReviewed) {
//       return res.status(403).json({
//         success: false,
//         message: "You have already reviewed this course",
//       });
//     }

//     const ratingReview = await RatingAndReview.create({
//       rating,
//       review,
//       course: courseId,
//       user: userId,
//     });
//     await Course.updateOne(
//       { _id: courseId },
//       {
//         $push: { ratingandreview: ratingReview._id },
//       },
//       { new: true }
//     );

//     res.status(201).json({
//       success: true,
//       message: "Review added successfully",
//       data: ratingReview,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// exports.getAverageRating = async (req, res) => {
//   try {
//     const { courseId } = req.body;
//     const result = await RatingAndReview.aggregate([
//       {
//         $match: {
//           course: new mongoose.Types.ObjectId(String(courseId)),
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           averageRating: { $avg: "$rating" },
//         },
//       },
//     ]);
//     if (result.length > 0) {
//       res.status(200).json({
//         success: true,
//         data: result[0].averageRating,
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "No rating found",
//       data: 0,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// exports.getAllRating = async (req, res) => {
//   try {
//     const allReviews = await RatingAndReview.find({})
//       .sort({ rating: "desc" })
//       .populate({
//         path: "user",
//         select: "firstName lastName email image",
//       })
//       .populate({
//         path: "Course",
//         select: "courseName",
//       })
//       .exec();

//     res.status(200).json({
//       success: true,
//       message: "All reviews fetched successfully",
//       data: allReviews,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

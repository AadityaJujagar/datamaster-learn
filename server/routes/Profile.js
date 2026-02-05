/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();

const { auth, isInstructor } = require("../middlewares/auth");

const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile");

router.delete("/deleteAccount", auth, deleteAccount);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateProfile", auth, updateProfile);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/getUserDetails", auth, getAllUserDetails);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;

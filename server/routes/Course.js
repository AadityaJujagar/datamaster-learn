/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();

// all course related controller functions
const {
  createCourse,
  showAllCourses,
  getCourseDetails,
  editCourse,
  deleteCourse,
  getInstructorCourses,
  getFullCourseDetails,
} = require("../controllers/Course");

const {
  createCategory,
  showAllCategory,
  categoryPageDetails,
} = require("../controllers/Category");

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");

const { updateCourseProgress } = require("../controllers/CourseProgress");

// importing middlewares
const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

// routes for courses
router.delete("/deleteCourse", deleteCourse);
router.post("/getCourseDetails", getCourseDetails);
router.get("/getAllCourses", showAllCourses);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
router.post("/createCourse", auth, isInstructor, createCourse);
router.put("/editCourse", auth, isInstructor, editCourse);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// routes for sections and subsections
router.post("/createSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection", auth, isInstructor, deleteSection);
router.post("/createSubSection", auth, isInstructor, createSubSection);
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);

// routes for admin
router.post("/createCategory", auth, isAdmin, createCategory);

// fetching data routes
router.post("/getCategoryPageDetails", categoryPageDetails);
router.get("/showAllCategories", showAllCategory);

module.exports = router;

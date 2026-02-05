/* eslint-disable no-undef */
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.user.id;

  try {
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({ message: "Subsection not found" });
    }

    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });
    if (!courseProgress) {
      return res.status(404).json({ message: "Course progress not found" });
    } else {
      if (courseProgress.completedVideos.includes(subSectionId)) {
        return res
          .status(200)
          .json({ message: "Subsection already marked as completed" });
      }
      courseProgress.completedVideos.push(subSectionId);
    }
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Subsection marked as completed",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error fetching subsection",
    });
  }
};

/* eslint-disable no-undef */
const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
require("dotenv").config();

// 8

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body;
    const video = req.files.videoUrl;
    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const uploadDetails = await uploadFileToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection");

    return res.status(201).json({
      success: true,
      message: "SubSection created successfully",
      data: updatedSection,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to create SubSection",
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    const video = req.files?.videoFile; // Video file is now optional

    if (!subSectionId || !title || !description) {
      return res.status(400).json({
        success: false, // Change to false because it's an error
        message: "SubSection ID, title, and description are required",
      });
    }

    let updateData = {
      title: title,
      description: description,
    };

    // If a video is uploaded, update the video URL
    if (video) {
      const uploadDetails = await uploadFileToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      updateData.videoUrl = uploadDetails.secure_url;
    }

    await SubSection.findByIdAndUpdate(subSectionId, updateData, { new: true });
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: updatedSection, // Fix here
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the subsection",
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId } = req.body;

    await SubSection.findByIdAndUpdate(
      subSectionId,
      {
        $pull: { subSections: subSectionId },
      },
      { new: true }
    );

    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }

    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );
    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the section",
    });
  }
};

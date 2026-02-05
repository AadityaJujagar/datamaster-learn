/* eslint-disable no-undef */
const Category = require("../models/Category");
function getRandomInt(num) {
  return Math.floor(Math.random() * num);
}
// 5

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: categoryDetails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error creating category",
    });
  }
};

exports.showAllCategory = async (req, res) => {
  try {
    const showAllCategories = await Category.find(
      {},
      { name: true, description: true }
    );

    res.status(200).json({
      success: true,
      message: "Categaries retrieved successfully",
      data: showAllCategories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        // populate: "ratingAndReview",
      })
      .exec();
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });
    
    let differentCategory = null;
    if (categoriesExceptSelected.length > 0) {
      const randomIndex = getRandomInt(categoriesExceptSelected.length);
      differentCategory = await Category.findOne(
        categoriesExceptSelected[randomIndex]._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec();
    }

    // all topSelling Courses
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const topSellingCourse = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      message: "Category page details",
      data: {
        selectedCategory,
        differentCategory,
        topSellingCourse,
      },
    });
    // todo: create contactUs
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching category page details",
    });
  }
};

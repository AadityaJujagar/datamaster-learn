/* eslint-disable no-undef */
const JWT = require("jsonwebtoken");
require("dotenv").config();

// 3

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).send({
        success: false,
        error: "Access denied. No token provided",
      });
    }

    try {
      const decoded = JWT.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      console.log("Error in token verification:", err); // Log the error for debugging
      return res.status(401).send({
        success: false,
        error: "Invalid or expired token",
      });
    }

    next();
  } catch (err) {
    console.log("Error during token verification:", err);
    res.status(500).send({
      success: false,
      error: "Error while verifying token",
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).send({
        success: false,
        error: "Access denied. You are not a student",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      error: "User role cannot be verified",
    });
  }
};

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).send({
        success: false,
        error: "Access denied. You are not an instructor",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      error: "User role cannot be verified",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).send({
        success: false,
        error: "Access denied. You are not an admin",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      error: "User role cannot be verified",
    });
  }
};

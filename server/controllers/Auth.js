/* eslint-disable no-undef */
const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { passwordUpdated } = require("../mail/templates/passwordUpdated");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

// 2.1

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    } else if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "OTP did not match",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber,
    });

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contactNumber,
      accountType,
      additionalData: profileDetails._id,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    const savedUser = await user.save();

    return res.status(200).json({
      success: true,
      savedUser,
      message: "User is registered successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again",
    });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const ifUserExists = await User.findOne({ email });
    if (ifUserExists) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    var result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    await OTP.create(otpPayload);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // VV-IMP : populate(), res.send
    const user = await User.findOne({ email }).populate("additionalData");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist, please register first",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = JWT.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      const userObj = user.toObject();
      userObj.token = token;
      userObj.password = undefined;
      // user.token = token;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user: userObj,
        message: "User logged in successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Login failed, please try again",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Check if user exists
    const existingUser = await User.findById(req.user.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate old password
    const isValidPassword = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid old password",
      });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();

    // Optional: Send email notification
    try {
      await mailSender(
        existingUser.email,
        "Password Updated Successfully",
        passwordUpdated(
          existingUser.email,
          `Your password was successfully updated.`
        )
      );
    } catch (err) {
      console.error("Error sending email:", err);
    }

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to change password, try again later",
    });
  }
};

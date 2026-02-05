/* eslint-disable no-undef */
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// 4

exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = crypto.randomUUID();
    await User.findOneAndUpdate(
      { email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    const url = `http://localhost:5173/update-password/${token}`;
    await mailSender(email, "Password Reset Link", `Click Here: ${url}`);

    return res.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to send password reset email",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const userToken = await User.findOne({ token: token });
    if (!userToken) {
      return res.status(404).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (userToken.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Password reset link has expired, regenerate again",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password, try again later",
    });
  }
};

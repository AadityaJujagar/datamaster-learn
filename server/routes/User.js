/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const {
  login,
  signup,
  sendOTP,
  changePassword,
} = require("../controllers/Auth");
const {
  resetPassword,
  resetPasswordToken,
} = require("../controllers/ResetPassword");

router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendOTP);
router.post("/changePassword", auth, changePassword);
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

module.exports = router;

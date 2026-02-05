/* eslint-disable no-undef */
const nodemailer = require("nodemailer");
require("dotenv").config();

// 2.3

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: "Aaditya Jujagar",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    return info;
  } catch (err) {
    console.error(err);
  }
};

module.exports = mailSender;

/* eslint-disable no-undef */
const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.log("Failed to connect to DB");
      console.error(err);
      process.exit(1);
    });
};

// models/MessageModel.js

const mongoose = require("mongoose");

// Defining the schema for user feedback
const MessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    rating: {
      type: String,
      enum: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Creating and exporting the Mongoose model
const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;

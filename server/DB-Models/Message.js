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
      type: Number,
      enum: [5, 4, 3, 2, 1],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    response: {
      type: String,
      trim: true,
      default: null, // Can be left empty until a response is provided
    },
  },
  {
    timestamps: true,
  }
);

// Creating and exporting the Mongoose model
const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;

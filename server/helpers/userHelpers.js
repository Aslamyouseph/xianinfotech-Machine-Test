const mongoose = require("mongoose");
const UserModel = require("../DB-Models/User-Account");
const FeedbackModel = require("../DB-Models/Message");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb"); // used to convert the string to ObjectId
const { reject } = require("promise");

module.exports = {
  // used for the signup operation
  doSignup: (userData) => {
    // console.log("Signup data in userHelpers:", userData);
    return new Promise(async (resolve, reject) => {
      try {
        const newUser = new UserModel(userData);
        const result = await newUser.save(); // Save to database
        // console.log("Signup successful!", result);
        resolve({ user: result });
      } catch (error) {
        reject(error);
      }
    });
  },
  //login operation
  dologin: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("This is the user entered data:", userData);
        // console.log("used entered email:", userData.email);

        let user = await UserModel.findOne({ email: userData.email });
        // console.log("User found in the database:", user);
        // if there is not a valid user available
        if (!user) {
          // console.log("User not found in the database.");

          return resolve({ status: false, message: "User not found" });
        }
        // console.log("User found, checking password...");

        const isPasswordCorrect = await bcrypt.compare(
          String(userData.password),
          user.password
        );
        // console.log("isPasswordCorrect:", isPasswordCorrect);

        if (!isPasswordCorrect) {
          // console.log("Incorrect password.");

          return resolve({ status: false, message: "Incorrect password" });
        }
        // console.log("Login successful!");

        resolve({ status: true, user: user });
      } catch (error) {
        console.error("Error during login:", error);
        reject({ status: false, message: "Login error occurred" });
      }
    });
  },
  // fetch the user data from the database
  getProfileDetails: (userID) => {
    // console.log(userID);
    return new Promise(async (resolve, reject) => {
      try {
        //finding the user by using the userID
        let userDetails = await UserModel.findById(userID).lean();
        resolve(userDetails);
        // console.log(userDetails);
      } catch (error) {
        reject(error);
      }
    });
  },
  //updating or editing the user profile details
  editUserDetails: (userDetails) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { id, name, email } = userDetails;
        await UserModel.findByIdAndUpdate(id, {
          name,
          email,
        });

        // Fetch the updated user details to return them
        const updatedUser = await UserModel.findById(id);
        resolve(updatedUser);
      } catch (error) {
        reject(error);
      }
    });
  },
  // storing the user Feedback
  doFeedback: (FeedBackData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newFeedBack = new FeedbackModel(FeedBackData);
        const result = await newFeedBack.save(); // Save to database
        resolve({ user: result });
      } catch (error) {
        reject(error);
      }
    });
  },
};

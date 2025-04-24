const mongoose = require("mongoose");
const UserModel = require("../DB-Models/User-Account");
const ConversationModel = require("../DB-Models/Conversations");
const MessageModel = require("../DB-Models/Message");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb"); // used to convert the string to ObjectId
const { reject } = require("promise");
const jwt = require("jsonwebtoken");

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
  // Helper function for editing user details
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
  //TODO: from here onwards the ChatApp operation starting
  createConversation: async (conversationData) => {
    const { senderId, receiverId } = conversationData;
    try {
      const newConversation = new ConversationModel({
        members: [senderId, receiverId],
      });
      const result = await newConversation.save();
      return result;
    } catch (error) {
      throw error;
    }
  },
  //get conversation operation
  getConversation: async (userId) => {
    try {
      const conversations = await ConversationModel.find({
        members: { $in: [userId] },
      }).populate("members");
      return conversations;
    } catch (error) {
      throw error;
    }
  },
  //Send Message
  sendMessage: async (messageData) => {
    try {
      const {
        conversationId,
        senderId,
        message,
        receiverId = "",
      } = messageData;
      if (conversationId === "new" && receiverId) {
        const newConversation = new ConversationModel({
          members: [senderId, receiverId],
        });
        await newConversation.save();
        const newMessage = new MessageModel({
          conversationId: newConversation._id,
          senderId,
          message,
        });
        await newMessage.save();
        return newMessage;
      }
      const newMessage = new MessageModel({
        conversationId,
        senderId,
        message,
      });
      await newMessage.save();
      return newMessage;
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  },
  //get message operation
  getMessage: async (messageData) => {
    try {
      const { conversationId } = messageData;
      const messages = await MessageModel.find({
        conversationId,
      });
      const messageUserData = await Promise.all(
        MessageModel.map(async (message) => {
          const user = await UserModel.findById(message.senderId);
          return {
            user: { id: user._id, email: user.email, fullName: user.fullName },
            message: message.message,
          };
        })
      );

      return messages;
    } catch (error) {
      throw error;
    }
  },
  //Get All Users Except Self
  getAllUsers: async (userId) => {
    try {
      const users = await UserModel.find({ _id: { $ne: userId } });
      const usersData = UserModel.map((user) => ({
        user: {
          email: user.email,
          fullName: user.fullName,
          receiverId: user._id,
        },
      }));
      return usersData;
    } catch (error) {
      throw error;
    }
  },
};

const mongoose = require("mongoose");
const UserModel = require("../DB-Models/User-Account");
const FeedbackModel = require("../DB-Models/Message");

module.exports = {
  //Fetching the FeedBack
  getFeedBack: async () => {
    try {
      //"".sort({ createdAt: -1 })""  =>This is used to display the Feedback in latest added order
      return await FeedbackModel.find().sort({ createdAt: -1 }); // Newest first;
    } catch (err) {
      console.error("Error fetching FeedBack:", err.message);
      throw err;
    }
  },

  // Removing or deleting the FeedBack by admin
  deleteFeedBack: async (NewsId) => {
    try {
      const deletedFeedback = await FeedbackModel.findByIdAndDelete(NewsId);

      if (!deletedFeedback) {
        throw new Error("FeedBack Detail is  not found");
      }
      return deletedFeedback;
    } catch (error) {
      throw error;
    }
  },
};

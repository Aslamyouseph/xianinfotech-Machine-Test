const express = require("express");
const router = express.Router();
const AdminHelpers = require("../helpers/AdminHelpers");

//Accessing the FeedBack by admin
router.get("/getFeedBack", async (req, res) => {
  try {
    const Feedback = await AdminHelpers.getFeedBack();
    // console.log(Feedback);
    res.status(200).json({ Feedback: Feedback });
  } catch (err) {
    console.error("Error fetching FeedBack:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching FeedBack ." });
  }
});

// Removing or deleting the Feedback by admin
router.delete("/deleteFeedBack/:id", async (req, res) => {
  try {
    const FeedBackId = req.params.id;
    const deletedFeedBack = await AdminHelpers.deleteFeedBack(FeedBackId); // Await the delete operation

    if (!deletedFeedBack) {
      return res
        .status(404)
        .json({ success: false, message: "FeedBack Details not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "FeedBack deleted successfully!" });
  } catch (err) {
    console.error("Error deleting FeedBack:", err);
    res
      .status(500)
      .json({ success: false, message: "Error deleting FeedBack." });
  }
});
module.exports = router;

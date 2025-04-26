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

// Adding the FeedBack response
router.put("/FeedBackResponse/:id", async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;
  // console.log("id", id);
  // console.log("response", response);
  if (!response) {
    return res.status(400).json({ message: "Response is required" });
  }
  try {
    const updatedFeedback = await AdminHelpers.updateFeedback(id, response);

    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback response added successfully" });
  } catch (error) {
    console.error("Error adding Feedback response:", error);
    res.status(500).json({
      message: "Failed to add feedback response. Please try again.",
    });
  }
});

module.exports = router;

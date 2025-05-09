const express = require("express");
const router = express.Router();
const userHelpers = require("../helpers/userHelpers"); // Accessing user-helpers file
// checking the user is logged or not .This block is used to check the user is logged or not when the control is came from the frontend
router.get("/checksection", (req, res) => {
  // console.log("Session after checksection:", req.session.user);
  if (req.session.user) {
    return res.status(200).json({ isLoggedIn: true, user: req.session.user });
  } else {
    return res.status(200).json({ isLoggedIn: false });
  }
});
// Signup operation
router.post("/signup", async (req, res) => {
  try {
    const response = await userHelpers.doSignup(req.body);

    // Store only necessary user details in session (NEVER store password)
    req.session.user = {
      id: response.user._id,
      name: response.user.name,
      email: response.user.email,
      password: response.user.password,
    };
    req.session.userLoggedIn = true; // Flag for logged-in state

    // Save the session data before responding
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error saving session",
        });
      }
      // console.log("Session after signup:", req.session);
      // Send response after session is stored
      res.status(200).json({
        success: true,
        message: "Signup successful",
        user: response.user,
      });
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Signup failed!",
      error: error.message,
    });
  }
});

// login operation
router.post("/login", (req, res) => {
  userHelpers.dologin(req.body).then((response) => {
    // console.log("Session before login:", req.session); // Log the session after setting user data
    // console.log("Login Response:", response); // Log the response
    if (response.status == true) {
      req.session.user = {
        id: response.user._id,
        name: response.user.name,
        email: response.user.email,
        password: response.user.password,
      };
      req.session.userLoggedIn = true;
      // let user = req.session.user;
      // console.log("user details from the session after login:", user);
      // console.log("Session after login:", req.session);
      // Respond back with success
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: response.user, // Send user data back
      });
    } else {
      req.session.userLoginErr = true;
      res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }
  });
});
// logout operation
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to log out" });
    }
    res.clearCookie("connect.sid", { path: "/" }); // Ensure the cookie is cleared
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  });
});

// fetch the user data from the database
router.get("/profile", async (req, res) => {
  try {
    // Debug the session data
    // console.log("Session Data before fetching profile:", req.session);
    // let userr = req.session.user;
    // console.log("user details from the session after profile:", userr);
    if (!req.session.user) {
      return res
        .status(401)
        .json({ success: false, message: "User  not authenticated" });
    }

    let user = req.session.user; // Should have user data here
    // console.log("User  from profile:", user);

    let profileDetails = await userHelpers.getProfileDetails(user.id); // Use user.id if that's what you stored
    // console.log("Profile Details:", profileDetails);

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: profileDetails,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// if the user is submitted the edited form edit is saved to the database
router.post("/editprofile", async (req, res) => {
  let userDetails = {
    id: req.body.id, // User ID from the frontend
    name: req.body.name,
    email: req.body.email,
  };

  try {
    const updatedUser = await userHelpers.editUserDetails(userDetails);
    req.session.user = updatedUser; // saving the updated data into the session
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile. Please try again.",
    });
  }
});
// Storing the user feedback in to the database
router.post("/Feedback", async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;
    if (!name || !email || !rating || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    await userHelpers.doFeedback(req.body);
    res.status(200).json({
      success: true,
      message: "Your Feedback has been submitted successfully",
    });
  } catch (error) {
    console.error("F error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback!",
      error: error.message,
    });
  }
});
module.exports = router;

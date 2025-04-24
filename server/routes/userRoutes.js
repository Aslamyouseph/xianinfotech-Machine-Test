const express = require("express");
const router = express.Router();
const userHelpers = require("../helpers/userHelpers"); // Accessing user-helpers file

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
//TODO: from here onwards the ChatApp operation starting

//Create Conversation operation
router.post("/conversation", async (req, res) => {
  try {
    const createConversation = await userHelpers.createConversation(req.body);
    res.status(200).json({
      success: true,
      message: "Conversation created successfully",
      user: createConversation,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create conversation. Please try again.",
    });
  }
});

//get conversation operation
router.get("/conversation/:userId", async (req, res) => {
  try {
    const getConversation = await userHelpers.getConversation(
      req.params.userId
    );
    res.status(200).json({
      success: true,
      message: "Conversation fetched successfully",
      user: getConversation,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation. Please try again.",
    });
  }
  //Send Message
  router.post("/message", async (req, res) => {
    try {
      const sendMessage = await userHelpers.sendMessage(req.body);
      res.status(200).json({
        success: true,
        message: "Message sent successfully",
        user: sendMessage,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send message. Please try again.",
      });
    }
  });

  // get the message
  router.get("/message/:conversationId", async (req, res) => {
    try {
      const getMessage = await userHelpers.getMessage(req.params);
      res.status(200).json({
        success: true,
        message: "Message fetched successfully",
        user: getMessage,
      });
    } catch (error) {
      console.error("Error fetching message:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch message. Please try again.",
      });
    }
  });
  // Get All Users Except Self
  router.get("/users/:userId", async (req, res) => {
    try {
      const getAllUsers = await userHelpers.getAllUsers(req.params.userId);
      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        user: getAllUsers,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users. Please try again.",
      });
    }
  });
});
module.exports = router;

const express = require("express");
const createError = require("http-errors");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./DB-configiration/DB-connection");
const UserRouter = require("./routes/userRoutes");
const socketIo = require("socket.io");
const http = require("http");

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend origin
    credentials: true, // Allow credentials (cookies)
  },
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend origin
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse form data

// Configure session (Place before routes)
app.use(
  session({
    secret: "your-strong-secret-key", // Use a strong secret key
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/yourdbname", // Replace with your DB name
      collectionName: "sessions", // Store sessions in "sessions" collection
    }),
    cookie: {
      httpOnly: true, // Prevent XSS attacks
      secure: false, // Set `true` if using HTTPS
      sameSite: "lax", // Prevent CSRF
      maxAge: 10 * 60 * 1000, // Session expires in 10 mins
    },
  })
);

// Socket.io Setup
let users = [];
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("addUser", (userId) => {
    if (!users.find((user) => user.userId === userId)) {
      users.push({ userId, socketId: socket.id });
      io.emit("getUsers", users);
    }
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, message, conversationId }) => {
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);
      const user = require("./DB-Models/User-Account");

      if (receiver) {
        io.to(receiver.socketId)
          .to(sender.socketId)
          .emit("getMessage", {
            senderId,
            message,
            conversationId,
            receiverId,
            user: { id: user._id, fullName: user.fullName, email: user.email },
          });
      } else {
        io.to(sender.socketId).emit("getMessage", {
          senderId,
          message,
          conversationId,
          receiverId,
          user: { id: user._id, name: user.name, email: user.email },
        });
      }
    }
  );

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});

// Routes
app.use("/api/user", UserRouter);

// Debugging: Check if session is working
app.get("/api/session", (req, res) => {
  res.json({ session: req.session });
});

// Handle 404 errors
app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

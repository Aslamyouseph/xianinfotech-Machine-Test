const express = require("express");
const createError = require("http-errors");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./DB-configiration/DB-connection");
const UserRouter = require("./routes/userRoutes");
// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 5000;

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

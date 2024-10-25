// Create routes - (5)

const express = require("express");
const router = express.Router();
const User = require("../models/User");

const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Middleware for JWT Authentication
const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    //res.render("login");
    return res.redirect("/user/login");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.redirect("/user/login");
  }
};

// Register routes -(6)
router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }

    // Get data
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).send("Registarion done successfully");
  }
);

// Login Routes
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.cookie("token", token, { httpOnly: true });
  res.status(200).json({ message: "Login successful" });
});

// Profile routes
router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render("profile", { user });
});

router.post("/profile", auth, upload.single("profileImg"), async (req, res) => {
  const user = await User.findById(req.user.id);
  user.name = req.body.name;
  if (req.file) {
    user.profileImg = req.file.profileImg;
  }
  await user.save();
  res.status(200).json({ message: "Profile updated successfully" });
});

// Logout route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/user/login");
});

module.exports = router;

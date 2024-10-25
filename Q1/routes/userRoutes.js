const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const upload = require("../config/multerConfig");
const router = express.Router();

router.post("/register", upload.array("files", 5), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const filePaths = req.files.map((file) => file.path);
    const user = new User({ name, email, password, files: filePaths });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/files", async (req, res) => {
  const users = await User.find();
  res.render("fileList", { users });
});

router.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  res.download(filePath);
});

module.exports = router;

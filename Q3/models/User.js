// Create schema and model - (4)

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profileImg: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;

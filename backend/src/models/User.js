const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  birthday: { type: Date },
  github_username: { type: String },
});

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);
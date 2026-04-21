const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !String(username).trim()) {
      return res.status(400).send("Username is required");
    }
    if (!password) {
      return res.status(400).send("Password is required");
    }

    const normalizedUsername = String(username).trim().toLowerCase();
    const normalizedEmail = email ? String(email).trim().toLowerCase() : undefined;

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail || undefined,
      password: hashed,
    });

    res.json({ id: user._id, username: user.username, email: user.email || null });
  } catch (err) {
    if (err?.code === 11000) {
      if (err?.keyPattern?.username) return res.status(409).send("Username already exists");
      if (err?.keyPattern?.email) return res.status(409).send("Email already exists");
      return res.status(409).send("Account already exists");
    }
    res.status(500).send("Signup failed");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !String(identifier).trim()) {
      return res.status(400).send("Username or email is required");
    }
    if (!password) return res.status(400).send("Password is required");

    const value = String(identifier).trim().toLowerCase();
    const isEmail = value.includes("@");

    const user = await User.findOne(isEmail ? { email: value } : { username: value });
    if (!user) return res.status(400).send("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).send("Wrong password");

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email || null },
      process.env.JWT_SECRET
    );

    res.json({ token });
  } catch {
    res.status(500).send("Login failed");
  }
});

module.exports = router;
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { username, password } = req.body;
    const email =
      req.body.email && String(req.body.email).trim() !== "" ? String(req.body.email).trim() : undefined;

    if (!username || !String(username).trim()) {
      return res.status(400).send("Username is required");
    }
    if (!password) {
      return res.status(400).send("Password is required");
    }

    const normalizedUsername = String(username).trim().toLowerCase();
    const normalizedEmail = email ? String(email).trim().toLowerCase() : undefined;

    console.log("SIGNUP INPUT:", {
      username: normalizedUsername,
      emailProvided: Boolean(normalizedEmail),
      hasPassword: Boolean(password),
    });

    const existing = await User.findOne(
      normalizedEmail
        ? { $or: [{ username: normalizedUsername }, { email: normalizedEmail }] }
        : { username: normalizedUsername }
    );
    if (existing) return res.status(400).send("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail || undefined,
      password: hashed,
    });

    res.json({ id: user._id, username: user.username, email: user.email || null });
  } catch (err) {
    console.log("SIGNUP ERROR:", err);

    if (err?.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    if (err?.code === 11000) {
      const fields = err?.keyValue ? Object.keys(err.keyValue).join(", ") : "unknown field";
      return res.status(400).json({ error: `E11000 duplicate key error (${fields})` });
    }

    return res.status(400).json({ error: err?.message || "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !String(username).trim()) {
      return res.status(400).send("Username is required");
    }
    if (!password) return res.status(400).send("Password is required");

    const value = String(username).trim().toLowerCase();
    const user = await User.findOne({ username: value });
    if (!user) return res.status(400).send("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).send("Wrong password");

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email || null },
      process.env.JWT_SECRET
    );

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send("Login failed");
  }
});

module.exports = router;
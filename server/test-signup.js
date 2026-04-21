require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function test() {
  await mongoose.connect(process.env.MONGO_URL);
  try {
    console.log("Trying to create a new user...");
    const user = await User.create({
      username: "testuser1",
      email: undefined,
      password: "password123",
    });
    console.log("User 1 created successfully:", user);
    
    console.log("Trying to create a second user with undefined email...");
    const user2 = await User.create({
      username: "testuser2",
      email: undefined,
      password: "password123",
    });
    console.log("User 2 created successfully:", user2);
  } catch(e) {
    console.error("Failed:", e);
  } finally {
    process.exit(0);
  }
}
test();

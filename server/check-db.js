require("dotenv").config();
const mongoose = require("mongoose");

async function check() {
  await mongoose.connect(process.env.MONGO_URL);
  const usersCol = mongoose.connection.collection("users");
  console.log("Indexes:");
  console.log(await usersCol.indexes());
  process.exit(0);
}
check();

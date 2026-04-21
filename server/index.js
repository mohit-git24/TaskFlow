require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/tasks", require("./routes/tasks"));

app.listen(5000, () => console.log("Server running"));
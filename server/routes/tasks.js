const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

router.post("/", auth, async (req, res) => {
  const task = await Task.create({
    userId: req.user.id,
    title: req.body.title
  });
  res.json(task);
});

router.put("/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body);
  res.json(task);
});

router.delete("/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

module.exports = router;
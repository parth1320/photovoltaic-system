const express = require("express");

const Project = require("../models/project");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const projects = await Project.find({ user: userId });
    res.status(201).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/project/:id", async (req, res) => {
  const { title, description, products } = req.body;
  const userId = req.params.id;

  console.log(title);

  try {
    const newProject = new Project({
      title,
      description,
      products,
      user: userId,
    });

    const savedProject = await newProject.save();
    res.json(savedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;

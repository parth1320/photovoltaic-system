const express = require("express");

const Project = require("../models/project");

const router = express.Router();

router.get("/allproject/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const projects = await Project.find({ user: userId }).populate("products");
    res.status(201).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/project/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("products");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(201).json(project);
  } catch (error) {
    console.error();
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/project/:id", async (req, res) => {
  const { name, description, products } = req.body;
  const userId = req.params.id;

  console.log(name);

  try {
    const newProject = new Project({
      user: userId,
      name,
      description,
      products,
    });

    const savedProject = await newProject.save();
    res.json(savedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("edit/:id", async (req, res) => {
  const projectId = req.params.id;
  const { name, description, products } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.name = name;
    project.description = description;
    project.products = products;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.remove();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error!" });
  }
});

module.exports = router;

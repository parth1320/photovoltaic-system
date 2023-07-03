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

router.put("/edit/:id", async (req, res) => {
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

// delete complete project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error!" });
  }
});

//delete product from project
router.delete("/:projectId/products/:productId", async (req, res) => {
  try {
    const { projectId, productId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404).json({ message: "Project not found" });
    }

    const productIndex = project.products.findIndex(
      (product) => product.toString() === productId,
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in the project" });
    }

    project.products.splice(productIndex, 1);

    await project.save();

    res.status(200).json({ message: "Product deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error!" });
  }
});

module.exports = router;

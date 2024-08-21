const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");

// Route for displaying all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render("blogs/index", { blogs, title: "All Blogs" });
  } catch (err) {
    res.status(500).send("Error retrieving blogs");
  }
});

// Route for creating a new blog (form)
router.get("/new", (req, res) => {
  res.render("blogs/new", { title: "Create New Blog" });
});

// Route for showing a single blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.render("blogs/show", { blog, title: blog.title });
  } catch (err) {
    res.status(404).send("Blog not found");
  }
});

// Route for editing a blog (form)
router.get("/:id/edit", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.render("blogs/edit", { blog, title: "Edit Blog" });
  } catch (err) {
    res.status(404).send("Blog not found");
  }
});

// Route for updating a blog
router.put("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.redirect(`/blogs/${blog._id}`);
  } catch (err) {
    res.status(400).send("Error updating blog");
  }
});

// Route for creating a new blog
router.post("/", async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.redirect("/blogs");
  } catch (err) {
    res.status(400).send("Error creating blog");
  }
});

module.exports = router;

const express = require("express");
const blogController = require("../Controllers/blogController");
const authController = require("../Controllers/authController");

const IDvalidation = require("../Middleware/IDvalidation");

const router = express.Router();

// *****************************GET ALL BLOGS*****************************
router.get("/getAllBlogs", blogController.getAllBlogPosts);

// **********************************CREATE A NEW BLOG********************
router.post("/create", blogController.createBlogPost);

module.exports = router;
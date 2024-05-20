const BlogPostModel = require("../models/blogModel");
const catchAsync = require("express-async-handler");
const AppError = require("../utils/appError");

//******************************CREATE A NEW BLOGPOST******************************

const createBlogPost = catchAsync(
  async (req, res, next) => {
    console.log(req.body);
    const {
      sellerLogo,
      sellerName,
      blogImageUrl,
      blogPosterUrl,
      blogHashTags,
      blogContent,
    } = req.body;

    const blogPost = await BlogPostModel.create({
      sellerName,
      sellerLogo,
      blogImageUrl,
      blogPosterUrl,
      blogContent,
      blogHashTags,
    });

    res.status(201).json({
      _id: blogPost._id,
      sellerName,
      sellerLogo,
      blogImageUrl,
      blogPosterUrl,
      blogContent,
      blogHashTags,
      createdAt: blogPost.createdAt,
    });
  },
  (error) => {
    res.status(500).json({ error: "Failed to create blog post" });
  }
);

//***************************** GET ALL BLOGPOSTS ************************************
const getAllBlogPosts = catchAsync(async (req, res, next) => {
  // await BlogPostModel.restore();
  const blogPosts = await BlogPostModel.find();
  res.status(200).json({
    numberOfBlogs: blogPosts.length,
    blogPosts,
  });
});

module.exports = {
  createBlogPost,
  getAllBlogPosts,
};
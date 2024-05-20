const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const BlogPostSchema = new mongoose.Schema(
  {
    sellerName: {
      type: String,
      required: true,
      trim: true,
    },
    sellerLogo: {
      type: String,
      required: true,
    },
    blogImageUrl: {
      type: String,
      required: true,
    },
    blogPosterUrl: {
      type: String,
      required: true,
    },
    blogHashTags: {
      type: String,
      required: true,
    },
    blogContent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

BlogPostSchema.plugin(mongooseDelete, { deletedAt: true });
BlogPostSchema.plugin(mongooseDelete, { overrideMethods: "all" });

const BlogPostModel = new mongoose.model("BlogPost", BlogPostSchema);

module.exports = BlogPostModel;
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },

  product: {
    type: String,
  },
  commentBy: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
commentSchema.plugin(mongooseDelete, { deletedAt: true });
commentSchema.plugin(mongooseDelete, { overrideMethods: "all" });

const Comment = new mongoose.model("Comment", commentSchema);

module.exports = Comment;
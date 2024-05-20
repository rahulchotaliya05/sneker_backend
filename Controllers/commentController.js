const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require("../models/productModel");
const { default: mongoose } = require("mongoose");

//************************* GET COMMENT OF A product **************************
const getCommentsOfProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const comments = await Comment.find();

  const productReviews = comments.filter(
    (commentss) => commentss.product === id
  );

  res.status(200).json({
    numberOfReviews: productReviews.length,
    productReviews,
  });
});

// ****************************** CREATE COMMENT ****************************

const createComment = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  // console.log(id);
  const newComment = await Comment.create({
    content: req.body.comment,
    rating: req.body.rating,
    product: id,
    commentBy: req.body.user,
  });
  const reqProduct = await Product.findById(id);
  reqProduct.reviews++;
  reqProduct.rating = ((reqProduct.rating + req.body.rating) / 2).toFixed(1);
  await reqProduct.save();
  if (newComment) {
    res.status(201).json({
      review: newComment,
    });
  } else {
    res.status(400).json({
      message: "comment not created",
    });
  }
});

//***************************** DELETE COMMENT *******************************

module.exports = {
  getCommentsOfProduct,
  createComment,
};
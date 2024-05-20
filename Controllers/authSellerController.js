const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Seller = require("../models/sellerModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const upload = require("../Middleware/multerSetup");
// ***********************SIGN TOKEN****************************

const signToken = (
  id,
  businessName,
  businessEmail,
  businessAddress,
  pancardnumber,
  phonenumber,
  businessType,
  // logoimg
) => {
  return jwt.sign(
    {
      id,
      businessName,
      businessEmail,
      businessAddress,
      pancardnumber,
      phonenumber,
      businessType,
      // logoimg,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};
const createSendToken = (user, statusCode, res) => {
  let token = signToken(
    user._id,
    user.businessName,
    user.businessEmail,
    user.businessAddress,
    user.pancardnumber,
    user.phonenumber,
    user.businessType,
    // user.logoimg
  );

  res.status(statusCode).json({
    status: "success",
    token,
    _id: user._id,
    businessName: user.businessName,
    businessEmail: user.businessEmail,
  });
};

// ********************SIGNING UP USER***********************

const sellersignup = catchAsync(async (req, res, next) => {
  const {
    businessName,
    businessEmail,
    pancardnumber,
    businessType,
    phonenumber,
    businessAddress,
    password,
  } = req.body;
  // console.log("file----", req.file);

  // const logoimg = req.file.path;

  const newSeller = await Seller.create({
    businessName,
    businessEmail,
    pancardnumber,
    businessType,
    phonenumber,
    businessAddress,
    password,
    // logoimg,
  });
  createSendToken(newSeller, 201, res);
});

// // ********************LOGGING IN USER ************************

const sellersignin = catchAsync(async (req, res, next) => {
  const { businessEmail, password } = req.body;

  if (!businessEmail || !password) {
    return next(new AppError("please provide email and password!", 400));
  }

  const seller = await Seller.findOne({ businessEmail }).select("+password"); //we use + bcz by default its selection is false in model

  if (!seller || !(await bcrypt.compare(password, seller.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signToken(
    seller._id,
    seller.businessName,
    seller.businessEmail,
    seller.businessAddress,
    seller.pancardnumber,
    seller.phonenumber,
    seller.businessType,
    // seller.logoimg
  );

  res.status(200).json({
    status: "success",
    _id: seller._id,
    token,
    businessName: seller.businessName,
    businessEmail: seller.businessEmail,
  });
});

module.exports = {
  sellersignup,
  sellersignin,
};
// this middleware is to validate the details for signup which are going to be filled
// by the user as repetition or missing fields are not acceptable

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const phoneNumberPattern = /^(?:\+91|0)?[6789]\d{9}$/;
const validGenders = ["male", "female", "others"];
const detailValidation = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    age,
    gender,
    phonenumber,
    address,
    password,
    passwordConfirm,
  } = req.body;

  let missingValues = [];

  if (!name) missingValues.push("Name ");
  if (!email) missingValues.push("Email ");
  if (!age) missingValues.push("Age ");
  if (!gender) missingValues.push("Gender ");
  if (!address) missingValues.push("Address ");
  if (!password) missingValues.push("password ");
  if (!passwordConfirm) missingValues.push("passwordConfirm ");

  if (missingValues.length > 0) {
    return next(
      new AppError(
        `required missing values : ${missingValues} is neccessary to be filled`,
        400
      )
    );
  }
  const userEmail = await User.findOne({ email });
  if (userEmail) {
    return next(new AppError("Email is Already Registered", 400));
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return next(new AppError("Email address is not valid", 400));
  }

  if (!phoneNumberPattern.test(phonenumber)) {
    return next(
      new AppError("Phone Number is not valid 10 digit Phone Number", 400)
    );
  }
  if (!validGenders.includes(gender)) {
    return next(
      new AppError('Select Gender from "male","female" & "others" ', 400)
    );
  }
  if (password !== passwordConfirm) {
    return next(
      new AppError("Password and Password confirm are not the same", 400)
    );
  }

  if (password.length < 5 || password.length >= 15) {
    return next(
      new AppError("Password is very short,put atleast 5 character", 400)
    );
  }

  if (
    !password.match(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  ) {
    return next(
      new AppError("Password is too weak, please pick a strong password", 400)
    );
  }

  next();
});

module.exports = detailValidation;
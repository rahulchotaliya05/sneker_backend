const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const upload = require("../Middleware/multerSetup");
const nodemailer = require("nodemailer");
// ***********************SIGN TOKEN****************************

const signToken = (
  id,
  name,
  email,
  address,
  age,
  phonenumber,
  gender,
  profileimg
) => {
  return jwt.sign(
    { id, name, email, address, age, phonenumber, gender, profileimg },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};
const createSendToken = (user, statusCode, res) => {
  let token = signToken(
    user._id,
    user.name,
    user.email,
    user.address,
    user.age,
    user.phonenumber,
    user.gender,
    user.profileimg
  );

  res.status(statusCode).json({
    status: "success",
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    address: user.address,
    age: user.age,
    phonenumber: user.phonenumber,
    gender: user.gender,
  });
};

// ********************SIGNING UP USER***********************

const signup = catchAsync(async (req, res, next) => {
  const { name, email, age, gender, phonenumber, address, password } = req.body;
  const profileimg = req.file.path;

  const newUser = await User.create({
    name,
    email,
    age,
    gender,
    phonenumber,
    address,
    password,
    profileimg,
  });
  createSendToken(newUser, 201, res);
});

// ********************LOGGING IN USER ************************

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password"); //we use + bcz by default its selection is false in model

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signToken(
    user._id,
    user.name,
    user.email,
    user.address,
    user.age,
    user.phonenumber,
    user.gender,
    user.profileimg
  );

  res.status(200).json({
    status: "success",
    _id: user._id,
    email,
    token,
    name: user.name,
    address: user.address,
    age: user.age,
    phonenumber: user.phonenumber,
    gender: user.gender,
  });
});
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Please Provide Email For Validation", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User Doesnt Exist", 401));
  }

  const resettoken = jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "5m",
    }
  );

  user.resetToken = resettoken;
  await user.save();
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jagritjoshi268@gmail.com",
      pass: "vntk pwme lcki qdys",
    },
  });
  const resetlink = `http://localhost:3000/resetPassword/${resettoken}`;
  const resetmessage = `<h2>Greetings User 👋</h2><h2>Click on the below link to reset password for Sneakers Hood =></h2> ${resetlink}. <h4>If you have not request this then please ignore.</h4>
  <h5>Regards,</h5>
  <h5>Sneakershood.com</h5>`;
  var mailOptions = {
    from: "jagritjoshi268@gmail.com",
    to: email,
    subject: "Reset Your Sneakers Hood Sign In Password",
    html: resetmessage,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("email errorr", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.status(200).json({
    status: "success",
    msg: "A Reset Password Link is Successfully Sent To Your Email",
    _id: user._id,
    email,
    resettoken,
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  const { resettoken, newpassword, confirmnewpassword } = req.body;

  if (user.resetToken != resettoken) {
    return next(new AppError("InValid Reset Link or may be expired", 400));
  }
  if (newpassword !== confirmnewpassword) {
    return next(
      new AppError(
        "New Password and confirm New Password  are not the same",
        400
      )
    );
  }

  if (newpassword.length < 5 || newpassword.length >= 15) {
    return next(
      new AppError("Password is very short,put atleast 5 character", 400)
    );
  }

  if (
    !newpassword.match(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  ) {
    return next(
      new AppError(
        " New Password is too weak, please pick a strong password",
        400
      )
    );
  }
  user.password = newpassword;
  user.resetToken = undefined;
  await user.save();

  res.status(201).json({
    msg: "Password Resets Successfully",
  });
});

const userMailQuery = catchAsync(async (req, res, next) => {
  const { name, email, query } = req.body;

  if (!email) {
    return next(new AppError("Please Provide Email For Validation", 400));
  }

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jagritjoshi268@gmail.com",
      pass: "vntk pwme lcki qdys",
    },
  });

  var mailOptions = {
    from: email,
    to: "jagritjoshi268@gmail.com",
    subject: `Query from ${name}`,
    text: query,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("email errorr", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.status(200).json({
    status: "success",
    msg: "Your Query is Successfully Sent To Admin",
  });
});
//******************************** Implementation of jwt ****************************
const protect = catchAsync(async (req, res, next) => {
  //  1)************ Getting token and check if it exits*************
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in please login to get access.", 401)
    );
  }

  // 2)******************verification token************************

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decode);
  // 3)************check if user still exists******************

  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists", 401)
    );
  }
  //***** grant access to protected routes ******
  req.user = currentUser; //putting user data in request
  next();
});

module.exports = {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  userMailQuery,
};
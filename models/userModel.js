const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please tell us your name!"],
      minlength: 6,
    },

    email: {
      type: String,
      require: [true, "pls provide your email"],
      unique: true,
      lowerCase: true,
      validate: [validator.isEmail, "pls provide a valid email"],
    },
    age: {
      type: Number,
      required: [true, "please tell us your age!"],
    },
    gender: {
      type: String,
      required: [true, "please tell us your gender!"],
    },
    phonenumber: {
      type: Number,
      required: [true, "please tell us your phone number!"],
    },
    address: {
      type: String,
      required: [true, "please tell us your address!"],
      minlength: 10,
    },

    password: {
      type: String,
      require: [true, "pls provide a password"],
      // minlength: 5,
      select: false,
    },

    passwordConfirm: {
      type: String,
      require: [true, "pls confirm your password "],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "passwords are not matching",
      },
    },
    // profileimg: {
    //   type: String,
    // },
    resetToken: {
      type: String,
      default: undefined,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
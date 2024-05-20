const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const sellerSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, "please tell us your name!"],
    },

    businessEmail: {
      type: String,
      require: [true, "pls provide your email"],
      unique: true,
      lowerCase: true,
      validate: [validator.isEmail, "pls provide a valid email"],
    },
    pancardnumber: {
      type: String,
      default:"KKBK123453215",
      // required: [true, "please tell us your pancard number!"],
      minlength: 10,
    },
    businessType: {
      type: String,
      required: [true, "please tell us your business type!"],
    },
    phonenumber: {
      type: Number,
      required: [true, "please tell us your phone number!"],
      minlength: 10,
    },
    businessAddress: {
      type: String,
      required: [true, "please tell us your address!"],
    },

    password: {
      type: String,
      require: [true, "pls provide a password"],
      minlength: 5,
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
    // logoimg: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const Seller = new mongoose.model("Seller", sellerSchema);
module.exports = Seller;
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("Invalid Email Id" + val);
        }
      },
    },
    password: {
      type: String,

      // validations with "validator" linrary in NPM
      validate(val) {
        if (!validator.isStrongPassword(val)) {
          throw new Error("Invalid password" + val);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,

      // custom validations
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "THis is my default data",
    },
    skills: {
      type: [String],
    },
    photoURL: {
      type: String,
    },
  },
  { timestamps: true }
);

// off loading the below functionality to the schema this we cam call it as (helper function)

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV#sai$123", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    user.password
  );

  return isPasswordValid;
};

// const UserModal = mongoose.model("user", userSchema)

module.exports = mongoose.model("user", userSchema);

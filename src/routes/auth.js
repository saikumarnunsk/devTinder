const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");

const User = require("../models/user");

const { validateSignUpData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validating of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    // Encript the password

    const passwordHash = await bcrypt.hash(password, 10);
    // creating new instance of the user modal
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("user added succsessfully !!!!");
  } catch (error) {
    res.status(400).send("error saving the user:" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    // 2. Compare password
    const isPasswordValid = await user.validatePassword(password);
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // get the token from helper function
      const token = await user.getJWT();
      //   const token = await jwt.sign({ _id: user._id }, "DEV#sai$123", {
      //     expiresIn: "1d",
      //   });
      // create a JWT token
      // Add the token to cookies and the response back to the user
      res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
      res.status(200).send({ message: "Login successful", userId: user._id });
    } else {
      return res.status(401).send("Invalid email or password");
    }

    // 3. Success
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// authRouter.post()

module.exports = authRouter;

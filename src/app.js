const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + "  sent the connection request");
});

// find user by email

app.get("/user", async (req, res) => {
  const email = req.body.emailId;
  try {
    const user = await User.find({ emailId: email });
    if (user.length === 0) {
      res.status(400).send("user not matched");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Somethimg went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    console.log("users", users);
    if (users.length) {
      await res.send(users);
    } else {
      res.status(400).send("no data avialble");
    }
  } catch (error) {
    res.status(400).send("something wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user data deleted successfully");
  } catch (error) {
    res.status(400).send("something wrong");
  }
});

// update the user of data

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const userData = req.body;
  try {
    const ALLOWED_FIELDS = [
      "gender",
      "photoUrl",
      "about",
      "frstName",
      "lastName",
    ];

    const isUpdateAllowed = Object.keys(userData).every((key) => {
      ALLOWED_FIELDS.includes(key);
    });
    if (!isUpdateAllowed) {
      throw new Error("update not alowed");
    }
    const user = await User.findByIdAndUpdate(userId, userData, {
      runValidators: true,
    });
    res.send("user data updated successfully");
  } catch (error) {
    res.status(400).send("something wrong:" + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("server is successfully listaning on port 3000");
    });
  })
  .catch((error) => {
    console.log("Database cannot be connected", error.message);
  });

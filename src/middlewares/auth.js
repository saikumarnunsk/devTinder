const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = (req, res, next) => {
  console.log("yes this is admin check");
  const AuthToken = "XYZ";
  const isAuthorized = AuthToken === "XYZ";
  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("Unauthorized request");
  }
};

const userAuth = async (req, res, next) => {
  // read the token from the req cookies and validate the token and find the user

  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is not valid !!!!!!");
    }
    const decodedObj = await jwt.verify(token, "DEV#sai$123");

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    } else {
      // we are adding user data to the req boday
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
};

module.exports = { adminAuth, userAuth };

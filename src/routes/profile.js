const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, (req, res) => {
  try {
    validateProfileData(req);

    if (!validateProfileData(req)) {
      throw new Error("invalid edit request, some fields are not editable!!");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((reqKey) => {
      return (loggedInUser[reqKey] = req.body[reqKey]);
    });
    loggedInUser.save();
    res.send(`${loggedInUser.firstName} profile updated successfully !!`);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = profileRouter;

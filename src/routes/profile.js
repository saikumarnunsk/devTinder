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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateProfileData(req);

    if (!validateProfileData(req)) {
      throw new Error("invalid edit request, some fields are not editable!!");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((reqKey) => {
      return (loggedInUser[reqKey] = req.body[reqKey]);
    });
    await loggedInUser.save();
    res.status(200).json({
      message: `${loggedInUser.firstName} profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = profileRouter;

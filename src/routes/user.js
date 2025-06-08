const { userAuth } = require("../middlewares/auth");

const express = require("express");
const { ConnectionRequest } = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

// get all the pending connection request for the loggedIn User
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
      //***************creating a relation between connectionRequestSchema and User collections *************
    }).populate("fromUserId", "firstName lastName photoURL age gender skills");
    // or you can pass array of keys }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "data fetchec successfully !!!",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error" + error.message,
    });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // sai==> dhana => accepted

    // dhana ==> kira ==> accpeted

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
      //***************creating a relation between connectionRequestSchema and User collections *************
    })
      .populate("fromUserId", "firstName lastName photoURL age gender skills")
      .populate("toUserId", "firstName lastName photoURL age gender skills");
    // or you can pass array of keys }).populate("fromUserId", ["firstName", "lastName"]);

    const data = connectionRequests.map((data) => {
      if (data.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return data.toUserId;
      }
      return data.fromUserId;
    });

    res.json({
      message: "data fetchec successfully !!!",
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error" + error.message,
    });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // user should see all the cards except
    // 1, his own card
    // 2, his connections
    // 3, ignored
    // 4, already send the connetion request

    const loggedInUser = req.user._id;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // find all the connections request (sent+received)

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    const hideUsersFormFeed = new Set();

    connectionRequest.forEach((request) => {
      hideUsersFormFeed.add(request.fromUserId.toString());
      hideUsersFormFeed.add(request.toUserId.toString());
    });

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFormFeed) } },
        {
          _id: { $nin: loggedInUser._id },
        },
      ],
    })
      .select("firstName lastName photoURL age gender skills about")
      .skip(skip)
      .limit(limit);

    res.json({
      message: "userFeed fetched successfully",
      data: feedUsers,
    });
  } catch (error) {
    res.status(400).send("some thing went wrong", error.message);
  }
});

module.exports = { userRouter };

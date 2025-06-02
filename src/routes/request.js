const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invalid status type : " + status });
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        throw new Error("toUser is not exists !!");
      }

      // if there is an existing connection request(A->B)
      const existingconnectionRequest = await ConnectionRequest.findOne({
        // it will check the A->B and b->a
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingconnectionRequest) {
        return res
          .status(400)
          .json({ message: "connection request is already axists !!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      // connectionRequest.save()

      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("Error :" + error.message);
    }
  }
);

module.exports = requestRouter;

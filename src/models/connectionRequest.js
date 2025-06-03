const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      //***************creating a relation between connectionRequestSchema and User collections *************
      ref: "user", // refference to the user cllection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user", // refference to the user cllection
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

// pre('save')	Middleware before saving a document

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // check if the fromUSerId is same as toUserId

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("cann't send connection request to yourself!!!!");
  }

  next();
});
const ConnectionRequest = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = { ConnectionRequest };

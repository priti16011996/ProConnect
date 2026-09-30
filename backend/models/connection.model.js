import mongoose, { Connection } from "mongoose";

const connectionSchema = mongoose.Schema(
  {
    sender: {
      type: String,
    },
    reciever: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamp: true },
);

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;

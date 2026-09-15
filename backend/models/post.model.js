import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      require: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
    ],
    comment: [
      {
        content: { type: String },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
        },
      },
    ],
  },
  { timestamp: true },
);

const POST = mongoose.model("POST", postSchema);

export default POST;

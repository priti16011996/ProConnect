import User from "../models/user.model.js";
import POST from "../models/post.model.js";
import { uploadOnCloudinary } from "../middlewares/upload.js";

export const createPost = async (req, res) => {
  try {
    let { description } = req.body;
    let newPost;
    if (req.file) {
      let image = await uploadOnCloudinary(req.file.path);

      newPost = await Post.create({
        author: req.userId,
        description,
        image,
      });
    } else {
      newPost = await Post.create({
        author: req.userId,
        description,
      });
    }
    return res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create new post" });
  }
};

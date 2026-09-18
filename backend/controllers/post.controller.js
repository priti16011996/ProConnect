import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { uploadOnCloudinary } from "../middlewares/upload.js";
import POST from "../models/post.model.js";

export const createPost = async (req, res) => {
  try {
    let { description } = req.body;
    let newPost;
    if (req.file) {
      let image = await uploadOnCloudinary(req.file.path);
      console.log("Post image: ", image);
      newPost = await POST.create({
        author: req.userId,
        description,
        image: image?.secure_url,
      });
    } else {
      newPost = await POST.create({
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

export const getPost = async (req, res) => {
  try {
    const { cursor, limit = 5 } = req.query;

    const pageLimit = Math.min(Number(limit), 10);

    let query = {};

    // Cursor format:
    // cursor = createdAt_timestamp_id
    if (cursor) {
      const [createdAt, id] = cursor.split("_");

      query = {
        $or: [
          {
            createdAt: {
              $lt: new Date(createdAt),
            },
          },
          {
            createdAt: new Date(createdAt),
            _id: {
              $lt: id,
            },
          },
        ],
      };
    }

    const posts = await Post.find(query)
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(pageLimit + 1)
      .populate("author", "firstName lastName profileImage headline")
      .lean();

    const hasMore = posts.length > pageLimit;

    if (hasMore) {
      posts.pop();
    }

    let nextCursor = null;

    if (posts.length > 0) {
      const lastPost = posts[posts.length - 1];

      nextCursor = `${lastPost.createdAt.toISOString()}_${lastPost._id}`;
    }

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
      pagination: {
        limit: pageLimit,
        hasMore,
        nextCursor,
      },
    });
  } catch (error) {
    console.error("Get Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

export const updateLike = async (req, res) => {
  try {
    let postId = req.params.id;
    let userId = req.userId;

    let post = await POST.findById({ postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.likes.includes(userId)) {
      post.likes.filter((id) => id != userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
  } catch (error) {
    console.log(error);
  }
};

export const updateComment = async (req, res) => {
  try {
    let postId = req.params.id;
    let userId = req.userId;
    let content = req.body;

    let post = await POST.findById({ postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let postComment = await findByIdAndUpdate(
      postId,
      {
        $push: {
          comment: {
            content,
            User: userId,
          },
        },
      },
      { new: true },
    ).populate("comment.user", "firstName, lastName, profileImage, headline");

    return res.status(200).json(postComment);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

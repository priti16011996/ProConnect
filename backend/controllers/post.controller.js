import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { uploadOnCloudinary } from "../middlewares/upload.js";
//import POST from "../models/post.model.js";

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
      .populate("comment.user", "firstName lastName profileImage headline")
      .lean();

    // ==========================================
    // CHECK CURRENT USER LIKE
    // ==========================================

    const postsWithLikeStatus = posts.map((post) => {
      const isLiked = req.userId
        ? post.like?.some(
            (userId) => userId.toString() === req.userId.toString(),
          )
        : false;

      return {
        ...post,
        isLiked,
      };
    });

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
      posts: postsWithLikeStatus,
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
    const postId = req.params.id;
    const userId = req.userId;
    console.log(postId, userId);
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const alreadyLiked = post.like.some(
      (id) => id.toString() === userId.toString(),
    );

    if (alreadyLiked) {
      // Unlike
      post.like = post.like.filter((id) => id.toString() !== userId.toString());
    } else {
      // Like
      post.like.push(userId);
    }

    await post.save();

    return res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",

      liked: !alreadyLiked,

      likeCount: post.like.length,
    });
  } catch (error) {
    console.log("Update like error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ==========================================
// CREATE COMMENT
// ==========================================

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;

    const userId = req.userId;

    const { content } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,

        message: "Comment cannot be empty",
      });
    }

    // ==========================================
    // FIND POST
    // ==========================================

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,

        message: "Post not found",
      });
    }

    // ==========================================
    // ADD COMMENT
    // ==========================================

    post.comment.push({
      content: content.trim(),

      user: userId,
    });

    await post.save();

    // ==========================================
    // POPULATE COMMENT USER
    // ==========================================

    await post.populate({
      path: "comment.user",

      select: "firstName lastName profileImage headline",
    });

    // ==========================================
    // GET NEW COMMENT
    // ==========================================

    const newComment = post.comment[post.comment.length - 1];

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,

      message: "Comment added successfully",

      comment: newComment,

      commentCount: post.comment.length,
    });
  } catch (error) {
    console.log("Create comment error:", error);

    return res.status(500).json({
      success: false,

      message: "Internal server error",
    });
  }
};

// ==========================================
// GET COMMENTS
// ==========================================

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;

    // ==========================================
    // FIND ONLY THE REQUIRED POST
    // ==========================================

    const post = await Post.findById(postId)

      .populate({
        path: "comment.user",

        select: "firstName lastName profileImage headline",
      });

    // ==========================================
    // POST NOT FOUND
    // ==========================================

    if (!post) {
      return res.status(404).json({
        success: false,

        message: "Post not found",
      });
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      comments: post.comment || [],

      commentCount: post.comment?.length || 0,
    });
  } catch (error) {
    console.log("Get comments error:", error);

    return res.status(500).json({
      success: false,

      message: "Internal server error",
    });
  }
};

export const sharePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const userId = req.userId;

    // Find original post
    const originalPost = await Post.findById(postId);

    if (!originalPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Prevent duplicate repost
    const alreadyShared = await Post.findOne({
      author: userId,
      sharedPost: postId,
    });

    if (alreadyShared) {
      return res.status(409).json({
        message: "You have already shared this post",
      });
    }

    // Create repost
    const newPost = await Post.create({
      author: userId,
      description: "",
      image: "",
      sharedPost: postId,
    });

    // Return populated post
    const populatedPost = await Post.findById(newPost._id)
      .populate("author", "firstName lastName profileImage headline")
      .populate({
        path: "sharedPost",
        populate: {
          path: "author",
          select: "firstName lastName profileImage headline",
        },
      });

    return res.status(201).json({
      message: "Post shared successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Share post error:", error);

    return res.status(500).json({
      message: "Failed to share post",
      error: error.message,
    });
  }
};

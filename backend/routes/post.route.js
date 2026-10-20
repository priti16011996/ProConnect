import express from "express";
import upload from "../middlewares/upload.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import {
  createPost,
  getPost,
  updateLike,
  createComment,
  getComments,
  sharePost,
  getUserPosts,
  getPostById,
} from "../controllers/post.controller.js";
const postRouter = express.Router();

postRouter.post(
  "/create",
  authenticateToken,
  upload.single("image"),
  createPost,
);

postRouter.get("/getPost", authenticateToken, getPost);

postRouter.get("/", authenticateToken, getPost);

postRouter.post("/:id/like", authenticateToken, updateLike);

//postRouter.post("/comment/:id", authenticateToken, updateComment);
postRouter.post("/:id/comment", authenticateToken, createComment);

postRouter.get("/:id/comment", authenticateToken, getComments);

postRouter.post("/:postId/share", authenticateToken, sharePost);

postRouter.get("/user/:userId", authenticateToken, getUserPosts);
postRouter.get("/:postId", authenticateToken, getPostById);

export default postRouter;

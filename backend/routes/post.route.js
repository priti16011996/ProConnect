import express from "express";
import upload from "../middlewares/upload.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import {
  createPost,
  getPost,
  updateLiket,
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

postRouter.get("/:id/like", authenticateToken, updateLike);

export default postRouter;

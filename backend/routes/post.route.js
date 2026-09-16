import express from "express";
import upload from "../middlewares/upload.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import { createPost } from "../controllers/post.controller.js";
const postRouter = express.Router();

postRouter.post(
  "/create",
  authenticateToken,
  upload.single("image"),
  createPost,
);

export default postRouter;

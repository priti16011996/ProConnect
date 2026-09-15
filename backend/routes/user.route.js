import express from "express";
import {
  loggedInUser,
  uploadProfileImage,
  updateProfile,
} from "../controllers/user.controller.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import upload from "../middlewares/upload.js";
const userRouter = express.Router();

userRouter.get("/currentUser", authenticateToken, loggedInUser);
// userRouter.post(
//   "/profile/image",
//   upload.single("profileImage"),
//   uploadProfileImage,
// );

userRouter.put(
  "/updateProfile",

  authenticateToken,

  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),

  updateProfile,
);

export default userRouter;

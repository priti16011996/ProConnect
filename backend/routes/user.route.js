import express from "express";
import { loggedInUser } from "../controllers/user.controller.js";
import authenticateToken from "../middlewares/authenticateToken.js";
const userRouter = express.Router();

userRouter.get("/currentUser", authenticateToken, loggedInUser);

export default userRouter;

import express from "express";
import { Signup, Login } from "../controllers/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/signup", Signup);
authRouter.post("/login", Login);

export default authRouter;

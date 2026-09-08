import express from "express";
import { Signup } from "../controllers/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/signup", Signup);

export default authRouter;

import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Import the connectDB function
import authRouter from "./routes/auth.route.js"; // Import the authRouter
import cookieParser from "cookie-parser"; // Import cookie-parser
import cors from "cors"; // Import cors
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware to parse cookies
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
  }),
);

app.listen(process.env.PORT, () => {
  connectDB(); // Call the connectDB function to establish the database connection
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.use("/v1/api/auth", authRouter); // Use the authRouter for authentication routes
app.use("/v1/api/user", userRouter); // Use the userRouter for user-related routes
app.use("/v1/api/post", postRouter);

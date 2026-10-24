import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Import the connectDB function
import authRouter from "./routes/auth.route.js"; // Import the authRouter
import cookieParser from "cookie-parser"; // Import cookie-parser
import cors from "cors"; // Import cors
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import connectionRouter from "./routes/connection.route.js";
import noticationRouter from "./routes/notification.route.js";
import http from "http";
import { Server, Socket } from "socket.io";

dotenv.config();
const app = express();
let server = http.createServer(app);
const PORT = process.env.PORT || 5000;

export const io = new Server(server, {
  cors: {
    origin: "https://proconnect-1-dm7h.onrender.com", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
  },
});

app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware to parse cookies
app.use(
  cors({
    origin: "https://proconnect-1-dm7h.onrender.com", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
  }),
);
export const userSocketMap = new Map();
io.on("connection", (Socket) => {
  console.log(`New User Connected with Socket Id: ${Socket.id}`);

  Socket.on("userConnected", (userId) => {
    userSocketMap.set(userId, Socket.id);
    console.log(userSocketMap);
  });

  io.on("disconnect", (Socket) => {
    console.log(`New User disConnected with Socket Id: ${Socket.id}`);
  });
});

app.use("/v1/api/auth", authRouter); // Use the authRouter for authentication routes
app.use("/v1/api/user", userRouter); // Use the userRouter for user-related routes
app.use("/v1/api/post", postRouter);
app.use("/v1/api/connection", connectionRouter);
app.use("/v1/api/notification", noticationRouter);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port: ${PORT}`);
});

// app.listen(process.env.PORT, () => {
//   connectDB(); // Call the connectDB function to establish the database connection
//   console.log(`Server is running on port ${process.env.PORT}`);
// });

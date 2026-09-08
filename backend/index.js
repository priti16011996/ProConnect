import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Import the connectDB function
import authRouter from "./routes/auth.route.js"; // Import the authRouter
dotenv.config();

const app = express();

app.use(express.json());

app.listen(process.env.PORT, () => {
  connectDB(); // Call the connectDB function to establish the database connection
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.use("/v1/api/auth", authRouter); // Use the authRouter for authentication routes

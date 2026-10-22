import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";
import fs from "fs/promises";
import cloudinary from "../config/cloudinary.js";
import { uploadOnCloudinary } from "../middlewares/upload.js";
export let loggedInUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching logged-in user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let { firstName, lastName, headline, location, email, userName, gender } =
      req.body;
    let skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    let education = req.body.education ? JSON.parse(req.body.education) : [];
    let experience = req.body.experience ? JSON.parse(req.body.experience) : [];

    let profileImage;
    let coverImage;

    console.log(req.files);
    if (req.files?.profileImage?.[0]) {
      const result = await uploadOnCloudinary(req.files.profileImage[0].path);

      profileImage = result?.secure_url;
    }

    if (req.files?.coverImage?.[0]) {
      const result = await uploadOnCloudinary(req.files.coverImage[0].path);

      coverImage = result?.secure_url;
    }

    let updatedUserData = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        headline,
        location,
        email,
        userName,
        gender,
        profileImage,
        coverImage,
        skills,
        education,
        experience,
      },
      { new: true },
    ).select("-password");
    console.log("User updated data", updatedUserData);
    res.status(200).json({
      message: "User Profile updated Successfully",
      user: updatedUserData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to update user profile data" });
  }
};
export const uploadProfileImage = async (req, res) => {
  let localFilePath;

  try {
    // Check whether file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    // Local file path
    localFilePath = req.file.path;

    console.log("File stored locally:", localFilePath);

    // Upload local file to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "my-app/profile-images",
      resource_type: "image",
    });

    console.log("Cloudinary URL:", cloudinaryResult.secure_url);

    // Save Cloudinary URL in MongoDB
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profileImage: cloudinaryResult.secure_url,
      },
      {
        new: true,
      },
    );

    // Delete local file AFTER Cloudinary + MongoDB succeed
    await fs.unlink(localFilePath);

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl: cloudinaryResult.secure_url,
      user,
    });
  } catch (error) {
    // If something fails, remove local file
    if (localFilePath) {
      try {
        await fs.unlink(localFilePath);
      } catch (deleteError) {
        console.log("Local file deletion failed:", deleteError.message);
      }
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);

    return res.status(500).json({
      message: "Failed to fetch user profile",
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(200).json({ users: [] });
    }

    const searchText = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const users = await User.find({
      $or: [
        { firstName: { $regex: searchText, $options: "i" } },
        { lastName: { $regex: searchText, $options: "i" } },
        { userName: { $regex: searchText, $options: "i" } },
      ],
    })
      .select("_id firstName lastName userName profileImage headline")
      .limit(10);

    res.status(200).json({ users });
  } catch (error) {
    console.error("Search users error:", error);

    res.status(500).json({
      message: "Failed to search users",
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  console.log("getSuggestedUsers called for user:", req.userId);
  try {
    const currentUserId = String(req.userId);

    // Get all connection records involving the logged-in user
    const connections = await Connection.find({
      $or: [{ sender: currentUserId }, { reciever: currentUserId }],
    }).lean();
    console.log("Connections involving the logged-in user:", connections);
    // Map each other user ID to a connection status
    const connectionMap = new Map();

    for (const connection of connections) {
      const senderId = String(connection.sender);
      const receiverId = String(connection.reciever);

      const otherUserId = senderId === currentUserId ? receiverId : senderId;

      let status;

      if (connection.status === "accepted") {
        status = "connected";
      } else if (connection.status === "pending") {
        status =
          senderId === currentUserId ? "pending_sent" : "pending_received";
      } else if (connection.status === "rejected") {
        status = "rejected";
      }

      if (status) {
        connectionMap.set(otherUserId, status);
      }
    }

    // Fetch users except yourself
    const users = await User.find({
      _id: { $ne: currentUserId },
    })
      .select("_id firstName lastName userName profileImage headline")
      .limit(100)
      .lean();

    // Attach status to each user
    const result = users.map((user) => ({
      ...user,
      connectionStatus: connectionMap.get(String(user._id)) || "connect",
    }));

    return res.status(200).json({ users: result });
  } catch (error) {
    console.error("getSuggestedUsers error:", error);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

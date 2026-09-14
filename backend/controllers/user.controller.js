import User from "../models/user.model.js";
import fs from "fs/promises";
import cloudinary from "../config/cloudinary.js";
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

export const updateProfile = async (req, res) => {};
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

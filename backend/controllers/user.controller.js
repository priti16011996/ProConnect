import User from "../models/user.model.js";
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

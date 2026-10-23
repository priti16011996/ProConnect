import Notification from "../models/Notification.model.js";
import POST from "../models/post.model.js";
export const getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({ reciever: req.userId })
      .populate("relatedUser", "firstName lastName profileImage")
      .populate("relatedPost", "image description");

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    return res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    let notificationId = req.params;
    let deleteNotification = await Notification.findByIdAndDelete({
      _id: notificationId,
      reciever: req.userId,
    });
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

export const clearAllNotification = async (req, res) => {
  try {
    let deleteNotifications = await Notification.deleteMany({
      reciever: req.userId,
    });
    res.status(200).json({ message: "Clear All Notifications Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to clear notifications",
      error: error.message,
    });
  }
};

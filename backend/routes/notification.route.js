import express from "express";
import {
  getNotifications,
  deleteNotification,
  clearAllNotification,
} from "../controllers/notification.controller.js";

import authenticateToken from "../middlewares/authenticateToken.js";

const notificationRouter = express.Router();

notificationRouter.get(
  "/getNotifications",
  authenticateToken,
  getNotifications,
);

notificationRouter.delete(
  "/deleteOne/:id",
  authenticateToken,
  deleteNotification,
);

notificationRouter.delete(
  "/deleteAll",
  authenticateToken,
  clearAllNotification,
);

export default notificationRouter;

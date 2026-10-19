import express from "express";
import authenticateToken from "../middlewares/authenticateToken.js";
import {
  ConnectionRequest,
  acceptConnection,
  rejectConnection,
  removeConnection,
  getConnectionStatus,
  getConnectionRequests,
  getUserConnections,
} from "../controllers/connection.controller.js";

const connectionRouter = express.Router();

connectionRouter.post("/send/:userId", authenticateToken, ConnectionRequest);
connectionRouter.put(
  "/accept/:connectionId",
  authenticateToken,
  acceptConnection,
);

connectionRouter.put(
  "/reject/:connectionId",
  authenticateToken,
  rejectConnection,
);

connectionRouter.get(
  "/getStatus/:userId",
  authenticateToken,
  getConnectionStatus,
);

connectionRouter.delete(
  "/remove/:connectionId",
  authenticateToken,
  removeConnection,
);

connectionRouter.get("/", authenticateToken, getUserConnections);

connectionRouter.get("/request", authenticateToken, getConnectionRequests);
export default connectionRouter;

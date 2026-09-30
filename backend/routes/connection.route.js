import express from "express";
import authenticateToken from "../middlewares/authenticateToken";
import {
  ConnectionRequest,
  acceptConnection,
  rejectConnection,
  removeConnection,
  getConnectionStatus,
  getConnectionRequests,
  getUserConnections,
} from "../controllers/connection.controller";

const connectionRouter = express.Router();

connectionRouter.get("/send/:id", authenticateToken, ConnectionRequest);
connectionRouter.get(
  "/accept/:connectionId",
  authenticateToken,
  acceptConnection,
);

connectionRouter.get(
  "/reject/:connectionId",
  authenticateToken,
  rejectConnection,
);

connectionRouter.get(
  "/remove/:connectionId",
  authenticateToken,
  removeConnection,
);

connectionRouter.get(
  "/getStatus/:connectionId",
  authenticateToken,
  getConnectionStatus,
);

connectionRouter.get("/", authenticateToken, getUserConnections);

connectionRouter.get("/request", authenticateToken, getConnectionRequests);
export default connectionRouter;

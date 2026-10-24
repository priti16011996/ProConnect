import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";
import { io } from "../index.js";
import { userSocketMap } from "../index.js";
import Notification from "../models/notification.model.js";

export const ConnectionRequest = async (req, res) => {
  try {
    const receiverId = req.params.userId;
    const senderId = req.userId;

    if (!receiverId || !senderId) {
      return res.status(400).json({
        message: "Sender ID and receiver ID are required",
      });
    }

    if (String(senderId) === String(receiverId)) {
      return res.status(400).json({
        message: "You cannot send a connection request to yourself",
      });
    }

    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (sender.connections.some((id) => String(id) === String(receiverId))) {
      return res.status(400).json({
        message: "You are already connected",
      });
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { sender: senderId, reciever: receiverId },
        { sender: receiverId, reciever: senderId },
      ],
    });

    if (existingConnection) {
      if (existingConnection.status === "pending") {
        return res.status(409).json({
          message: "A connection request already exists",
        });
      }

      return res.status(409).json({
        message: "A previous connection request already exists",
      });
    }

    await Connection.create({
      sender: senderId,
      reciever: receiverId,
      status: "pending",
    });

    const receiverSocketId = userSocketMap.get(String(receiverId));
    const senderSocketId = userSocketMap.get(String(senderId));

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updatedUserId: senderId,
        newStatus: "received",
      });
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: receiverId,
        newStatus: "pending",
      });
    }

    return res.status(201).json({
      message: "Connection request sent successfully",
      status: "pending",
    });
  } catch (error) {
    console.error("Connection request error:", error);

    return res.status(500).json({
      message: "Failed to send connection request",
    });
  }
};

export const acceptConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.userId;

    console.log("Accept Connection ID:", connectionId);

    // Find the actual connection document
    const connectionExist = await Connection.findById(connectionId);

    if (!connectionExist) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    // Only the recipient can accept the request
    if (connectionExist.reciever.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to accept this request",
      });
    }

    // Accept only pending requests
    if (connectionExist.status !== "pending") {
      return res.status(400).json({
        message: "This request is no longer pending",
      });
    }

    // Update connection status
    connectionExist.status = "accepted";
    let notification = Notification.create({
      reciever: connectionExist.sender,
      type: "connectionAccept",
      relatedUser: userId,
    });
    await connectionExist.save();

    const senderId = connectionExist.sender.toString();
    const receiverId = connectionExist.reciever.toString();

    // Add each user to the other's connections
    await Promise.all([
      User.findByIdAndUpdate(receiverId, {
        $addToSet: { connections: senderId },
      }),
      User.findByIdAndUpdate(senderId, {
        $addToSet: { connections: receiverId },
      }),
    ]);

    // Notify users through Socket.IO
    const receiverSocketId = userSocketMap.get(receiverId);
    const senderSocketId = userSocketMap.get(senderId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updatedUserId: senderId,
        newStatus: "disconnect",
      });
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: receiverId,
        newStatus: "disconnect",
      });
    }

    return res.status(200).json({
      message: "Connection request accepted successfully",
      connection: connectionExist,
    });
  } catch (error) {
    console.error("Error accepting connection:", error);

    return res.status(500).json({
      message: "Failed to accept connection request",
    });
  }
};

export const rejectConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.userId;

    // Find the connection document
    const connectionExist = await Connection.findById(connectionId);

    if (!connectionExist) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    // Only the recipient can reject the request
    if (connectionExist.reciever.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to reject this request",
      });
    }

    // Reject only pending requests
    if (connectionExist.status !== "pending") {
      return res.status(400).json({
        message: "This request is no longer pending",
      });
    }

    // Update connection status
    connectionExist.status = "rejected";
    await connectionExist.save();

    return res.status(200).json({
      message: "Connection rejected successfully",
      connection: connectionExist,
    });
  } catch (error) {
    console.error("Error rejecting connection:", error);

    return res.status(500).json({
      message: "Failed to reject connection request",
    });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const targetedUserId = req.params.userId;
    const currentUserId = req.userId;

    if (!targetedUserId) {
      return res.status(400).json({
        message: "Target user ID is required",
      });
    }

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({
        message: "Current user not found",
      });
    }

    const isConnected = currentUser.connections.some(
      (id) => String(id) === String(targetedUserId),
    );

    if (isConnected) {
      return res.status(200).json({
        status: "disconnect",
      });
    }

    const existingRequest = await Connection.findOne({
      $or: [
        { sender: currentUserId, reciever: targetedUserId },
        { sender: targetedUserId, reciever: currentUserId },
      ],
      status: "pending",
    });

    if (!existingRequest) {
      return res.status(200).json({
        status: "connect",
      });
    }

    if (String(existingRequest.sender) === String(currentUserId)) {
      return res.status(200).json({
        status: "pending",
        requestId: existingRequest._id,
      });
    }

    return res.status(200).json({
      status: "received",
      requestId: existingRequest._id,
    });
  } catch (error) {
    console.error("Get connection status error:", error);

    return res.status(500).json({
      message: "Failed to get connection status",
    });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const loggedInUserId = req.userId;
    const removerUserId = req.params.connectionId;

    await User.findByIdAndUpdate(loggedInUserId, {
      $pull: {
        connections: removerUserId,
      },
    });

    await User.findByIdAndUpdate(removerUserId, {
      $pull: {
        connections: loggedInUserId,
      },
    });
    let recieverSocketId = userSocketMap.get(removerUserId);
    let senderSocketId = userSocketMap.get(loggedInUserId);

    if (recieverSocketId) {
      io.to(recieverSocketId).emit("statusUpdate", {
        updatedUserId: loggedInUserId,
        newStatus: "connect",
      });
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: removerUserId,
        newStatus: "connect",
      });
    }

    return res.status(200).json({ message: "Connection removed Successfully" });
  } catch (error) {
    return res
      .status(200)
      .json({ message: `failed to remove connection due to error : ${error}` });
  }
};

export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.userId;

    console.log("Fetching connection requests for userId:", userId);

    const UserList = await Connection.find({
      reciever: userId,
      status: "pending",
    }).populate(
      "sender",
      "firstName lastName email userName profileImage headline connections",
    );

    console.log("UserList:", UserList);

    return res.status(200).json(UserList);
  } catch (error) {
    console.error("Error fetching connection requests:", error);

    return res.status(500).json({
      message: "Failed to get connection requests",
    });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    let userId = req.userId;
    let UserList = await User.findById(userId).populate(
      "connections",
      "firstName lastName email userName profileImage headline connections",
    );
    return res.status(200).json(UserList);
  } catch (error) {
    return res.status(500).json({
      message: `Failed to find total connected users due to error :${error}`,
    });
  }
};

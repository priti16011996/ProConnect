import Connection from "../models/connection.model";
import User from "../models/user.model";

export const ConnectionRequest = async (req, res) => {
  try {
    let recieverId = req.params;
    let senderId = req.userId;

    let user = User.findById(senderId);

    if (!user) {
      return res.status(404).json({ message: "Failed to find the user" });
    }

    if (senderId == recieverId) {
      return res.status(401).json({
        message: "You are not allowed to send request to youself",
      });
    }

    if (user.Connection.includes(senderId)) {
      return res
        .status(400)
        .json({ message: "You are alraedy connected with the same User" });
    }

    let connectionExist = await Connection.findOne({
      sender: senderId,
      reciever: recieverId,
      status: "pending",
    });
    if (connectionExist) {
      return res.status(400).json({ message: "Connection already Exist" });
    }

    let createConnection = await Connection.create({
      sender: senderId,
      reciever: recieverId,
    });

    return res
      .status(201)
      .json({ message: "User Connection request send successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to connect the user ${error}` });
  }
};

export const acceptConnection = async (req, res) => {
  try {
    let connectionId = req.params;
    let connectionExist = Connection.findById({ connectionId });

    if (!connectionExist) {
      return res.status(404).json({ message: "Failed to find the connection" });
    }

    if (connectionExist.status == "pending") {
      return res
        .status(400)
        .json({ message: "Connection request already is in progress" });
    }

    connectionExist.status = "acepted";
    await connectionExist.save();
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: {
        connections: connections.sender._id,
      },
    });
    await User.findByIdAndUpdate(connections.sender._id, {
      $addToSet: {
        connections: req.userId,
      },
    });
    return res
      .status(200)
      .json({ message: "Connection request send successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `failed to send connection request and error : ${error}`,
    });
  }
};

export const rejectConnection = async (req, res) => {
  try {
    let connectionId = req.params;
    let connectionExist = Connection.findById({ connectionId });

    if (!connectionExist) {
      return res.status(404).json({ message: "Failed to find the connection" });
    }

    if (connectionExist.status == "pending") {
      return res
        .status(400)
        .json({ message: "Connection request already is in progress" });
    }

    connectionExist.status = "rejected";
    await connectionExist.save();
    return res
      .status(200)
      .json({ message: "Connection rejected successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `failed to rejected connection request and error : ${error}`,
    });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    let targetedUser = req.params.body;
    let currentUser = req.userId;

    let CurrUser = await User.findById(currentUser);
    if (CurrUser.connections.includes(targetedUser)) {
      return res.status(200).json({ status: "disconnect" });
    }

    const pendingRequest = await connection.findOne({
      $or: [
        {
          sender: targetedUser,
          reciever: currentUser,
        },
        {
          sender: currentUser,
          reciever: targetedUser,
        },
      ],
      status: "pending",
    });

    if (pendingRequest) {
      if (pendingRequest.sender.toString == currentUser.toString) {
        return res.status(200).json({ status: "pending" });
      } else {
        return res
          .status(200)
          .json({ status: "recieved", requestId: pendingRequest._id });
      }
      return res.status(200).json({ status: "Connect" });
    }
  } catch (error) {
    return res
      .status(200)
      .json({ message: `Failed to get status and error is :${error}` });
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

    const UserList = await Connection.findById({
      reciever: userId,
      status: "pending",
    }).populate(
      "sender",
      "firstName lastName email userName profileImage headline connections",
    );

    return res.status(200).json(UserList);
  } catch (error) {
    return res.status(500).json({
      message: `failed to get requested userlist due to error: ${error}`,
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
    return res
      .status(500)
      .json({
        message: `Failed to find total connected users due to error :${error}`,
      });
  }
};

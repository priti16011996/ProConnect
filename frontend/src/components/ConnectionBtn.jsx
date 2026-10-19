
import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { AuthContextData } from "../context/AuthContext";
import { userContextData } from "../context/UserContext";
import { socket } from "../socket.js";
import { useNavigate } from 'react-router-dom';

const ConnectionBtn = ({ userId }) => {
    const { serverUrl } = useContext(AuthContextData);
    const { userData } = useContext(userContextData);
    const [status, setStatus] = useState("connect");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendConnect = async () => {
        if (loading || status !== "connect") return;

        try {
            setLoading(true);

            const result = await axios.post(
                `${serverUrl}/v1/api/connection/send/${userId}`,
                {},
                { withCredentials: true }
            );
            console.log("handleSendConnect result:", result);
            // setStatus("Pending");
        } catch (error) {
            console.log("Error sending connection request:", error.response?.data || error);

            // Refresh status in case the request already exists.
            // await handleGetStatus();
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveConnection = async () => {
        if (loading || status !== "disconnect") return;

        try {
            setLoading(true);

            const result = await axios.delete(
                `${serverUrl}/v1/api/connection/remove/${userId}`,
                { withCredentials: true }
            );
            console.log("handleRemoveConnection result:", result);
            // setStatus("Pending");
        } catch (error) {
            console.log("Error removing connection request:", error.response?.data || error);

            // Refresh status in case the request already exists.
            // await handleGetStatus();
        } finally {
            setLoading(false);
        }
    };

    const handleGetStatus = async () => {
        if (!serverUrl || !userId) return;

        try {
            const response = await axios.get(
                `${serverUrl}/v1/api/connection/getStatus/${userId}`,
                { withCredentials: true }
            );
            console.log("Connection status response:", response.data);
            setStatus(response.data.status || "connect");
        } catch (error) {
            console.error(
                "Error fetching connection status:",
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        const currentUserId = userData?.user?._id;

        if (currentUserId) {
            socket.emit("userConnected", currentUserId);
        }
        handleGetStatus();

        socket.on("statusUpdate", ({ updatedUserId, newStatus }) => {
            console.log("Received statusUpdate:", { updatedUserId, newStatus });
            if (String(updatedUserId) === String(userId)) {
                setStatus(newStatus)
            }
        })

        return () => {
            socket.off("statusUpdate");
        }
    }, [userId]);

    const handleClick = async () => {
        console.log("Disconnecting from user:", userId);
        if (status === "disconnect") {
            console.log("Disconnecting from user:", userId);
            await handleRemoveConnection();
        }
        else if (status === "received") {
            navigate("/network")
        }
        else {
            await handleSendConnect();
        }
    }





    return (
        <button
            type="button"
            onClick={handleClick}
            className="rounded-full border border-blue-600 px-4 py-1.5
        text-sm font-semibold text-blue-600 transition
        hover:bg-blue-50 disabled:cursor-not-allowed
        disabled:opacity-60"
            disabled={status === "pending"}
        >
            {loading ? "Please wait..." : status}
        </button>
    );
};

export default ConnectionBtn;

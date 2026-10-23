
import React, {
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContextData } from "../context/AuthContext";
import { userContextData } from "../context/UserContext";
import { socket } from "../socket.js";

const ConnectionBtn = ({ userId }) => {
    const { serverUrl } = useContext(AuthContextData);
    const { userData } = useContext(userContextData);
    const navigate = useNavigate();

    const [status, setStatus] = useState("connect");
    const [loading, setLoading] = useState(false);

    const currentUserId = userData?.user?._id;

    const handleGetStatus = useCallback(async () => {
        if (!serverUrl || !userId || !currentUserId) return;

        try {
            const response = await axios.get(
                `${serverUrl}/v1/api/connection/getStatus/${userId}`,
                { withCredentials: true }
            );
            console.log({
                currentUserId,
                profileUserId: userId,
                status: response.data.status,
            });

            setStatus(response.data.status || "connect");
        } catch (error) {
            console.error(
                "Error fetching connection status:",
                error.response?.data || error.message
            );
        }
    }, [serverUrl, userId, currentUserId]);

    useEffect(() => {
        if (!currentUserId || !userId) return;

        socket.emit("userConnected", currentUserId);

        handleGetStatus();

        const handleStatusUpdate = ({
            updatedUserId,
            newStatus,
        }) => {
            if (String(updatedUserId) === String(userId)) {
                setStatus(newStatus);
            }
        };

        socket.on("statusUpdate", handleStatusUpdate);

        return () => {
            socket.off("statusUpdate", handleStatusUpdate);
        };
    }, [currentUserId, userId, handleGetStatus]);

    const handleSendConnect = async () => {
        if (loading || status !== "connect") return;

        try {
            setLoading(true);

            await axios.post(
                `${serverUrl}/v1/api/connection/send/${userId}`,
                {},
                { withCredentials: true }
            );

            setStatus("pending");
        } catch (error) {
            console.error(
                "Error sending connection request:",
                error.response?.data || error
            );

            // Re-fetch status in case the request already exists.
            await handleGetStatus();
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveConnection = async () => {
        if (loading || status !== "disconnect") return;

        const confirmed = window.confirm(
            "Are you sure you want to remove this connection?"
        );

        if (!confirmed) return;

        try {
            setLoading(true);

            await axios.delete(
                `${serverUrl}/v1/api/connection/remove/${userId}`,
                { withCredentials: true }
            );

            setStatus("connect");
        } catch (error) {
            console.error(
                "Error removing connection:",
                error.response?.data || error
            );

            await handleGetStatus();
        } finally {
            setLoading(false);
        }
    };

    const handleClick = async () => {
        if (loading) return;

        switch (status) {
            case "connect":
                await handleSendConnect();
                break;

            case "pending":
                // Request already sent. No duplicate request.
                break;

            case "received":
                // Open the page where incoming requests are handled.
                navigate("/network");
                break;

            case "disconnect":
                await handleRemoveConnection();
                break;

            default:
                await handleGetStatus();
        }
    };

    const buttonConfig = {
        connect: {
            label: "Connect",
            className:
                "border-sky-600 text-sky-700 hover:bg-sky-50",
            disabled: false,
        },
        pending: {
            label: "Pending",
            className:
                "border-gray-300 text-gray-500 bg-gray-50",
            disabled: true,
        },
        received: {
            label: "Accept request",
            className:
                "border-sky-600 text-sky-700 hover:bg-sky-50",
            disabled: false,
        },
        disconnect: {
            label: "Connected",
            className:
                "border-green-600 text-green-700 hover:bg-green-50",
            disabled: false,
        },
    };

    const config = buttonConfig[status] || buttonConfig.connect;

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={loading || config.disabled}
            className={`shrink-0 rounded-full border px-3 py-1.5
                text-sm font-semibold transition-colors
                disabled:cursor-not-allowed disabled:opacity-60
                ${config.className}`}
        >
            {loading ? "Please wait..." : config.label}
        </button>
    );
};

export default ConnectionBtn;

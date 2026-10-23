
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Nav from "./Nav";
import { AuthContextData } from "../context/AuthContext";
import { RiDeleteBin5Line } from "react-icons/ri";

function Notification() {
    const { serverUrl } = useContext(AuthContextData);

    const [notificationData, setNotification] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleGetNotification = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await axios.get(
                `${serverUrl}/v1/api/notification/getNotifications`,
                { withCredentials: true }
            );

            console.log("Notification Result:", result.data);

            // Support either an array or an object containing notifications.
            const notifications = Array.isArray(result.data)
                ? result.data
                : result.data.notifications || [];

            setNotification(notifications);
        } catch (error) {
            console.error("Failed to get notifications:", error);
            setError("Failed to get notifications. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleNotification = (type) => {
        switch (type) {
            case "like":
                return " liked your post";
            case "comment":
                return " commented on your post";
            case "connectionAccept":
                return " accepted your connection request";
            case "connectionRequest":
                return " sent you a connection request";
            default:
                return " interacted with you";
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            setLoading(true);
            setError("");

            const result = await axios.delete(
                `${serverUrl}/v1/api/notification/deleteOne/${notificationId}`,
                { withCredentials: true }
            );
            console.log("Delete Notification Result:", result.data);
            await handleGetNotification();
        } catch (error) {
            console.error("Failed to get notifications:", error);
            setError("Failed to get notifications. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClearAllNotification = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await axios.delete(
                `${serverUrl}/v1/api/notification/deleteAll`,
                { withCredentials: true }
            );
            console.log("Clear All Notifications Result:", result.data);
            await handleGetNotification();
        } catch (error) {
            console.error("Failed to get notifications:", error);
            setError("Failed to get notifications. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        handleGetNotification();
    }, []);

    return (
        <div className="min-h-screen bg-[#f3f2ef]">
            <Nav />

            <main className="max-w-4xl mx-auto px-4 py-8 mt-10">
                <section className="bg-white rounded-lg shadow-sm px-5 py-6 mb-5 flex items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Notifications
                        <span className="ml-2 text-gray-500">
                            {notificationData.length}
                        </span>
                    </h1>

                    {notificationData.length > 0 && (
                        <button
                            onClick={handleClearAllNotification}
                            disabled={loading}
                            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                            Clear All
                        </button>
                    )}
                </section>
                <section className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                        <p className="p-6 text-gray-500">
                            Loading notifications...
                        </p>
                    ) : error ? (
                        <div className="p-6">
                            <p className="text-red-600">{error}</p>
                            <button
                                onClick={handleGetNotification}
                                className="mt-3 text-blue-600 font-medium"
                            >
                                Try again
                            </button>
                        </div>
                    ) : notificationData.length === 0 ? (
                        <p className="p-6 text-gray-500">
                            No notifications yet.
                        </p>
                    ) : (
                        notificationData.map((notification) => {
                            const user = notification.relatedUser;

                            if (!user) return null;

                            const fullName = [
                                user.firstName,
                                user.lastName,
                            ]
                                .filter(Boolean)
                                .join(" ") || user.userName || "Unknown user";

                            const post = notification.relatedPost;

                            return (
                                <div
                                    key={notification._id}
                                    className="flex items-start gap-4 px-5 py-5 border-b border-gray-100 hover:bg-gray-50 transition"
                                >
                                    <img
                                        src={
                                            user.profileImage ||
                                            "https://placehold.co/100x100?text=User"
                                        }
                                        alt={fullName}
                                        className="w-14 h-14 rounded-full object-cover shrink-0"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-800">
                                            <span className="font-semibold">
                                                {fullName}
                                            </span>
                                            {handleNotification(notification.type)}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {user.headline || "Member"}
                                        </p>

                                        {post?.image && (
                                            <img
                                                src={post.image}
                                                alt="Related post"
                                                className="mt-3 w-32 h-24 rounded-md object-cover"
                                            />
                                        )}
                                        {post?.description && (
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2 break-words">
                                                {post.description || "description"}
                                            </p>
                                        )}
                                        {notification.createdAt && (
                                            <p className="text-xs text-gray-400 mt-2">
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDeleteNotification(notification._id)}
                                        disabled={loading}
                                        title="Delete notification"
                                        className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                                    >
                                        <RiDeleteBin5Line className="h-6 w-6" />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </section>
            </main>
        </div>
    );
}

export default Notification;

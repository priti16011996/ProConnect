
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import Nav from "./Nav";
import { AuthContextData } from "../context/AuthContext";

function Network() {
    const { serverUrl } = useContext(AuthContextData);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleNetworkConnections = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await axios.get(
                `${serverUrl}/v1/api/connection/request`,
                { withCredentials: true }
            );

            setConnections(Array.isArray(result.data) ? result.data : []);
        } catch (err) {
            console.error("Error fetching connection requests:", err);
            setError("Unable to load invitations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleNetworkConnections();
    }, []);

    const handleAcceptConnection = async (connectionId) => {
        try {
            setLoading(true);
            setError("");

            const result = await axios.put(
                `${serverUrl}/v1/api/connection/accept/${connectionId}`,
                {},
                { withCredentials: true }
            );
            setConnections((prevConnections) =>
                prevConnections.filter((request) => request._id !== connectionId)
            );

            console.log("Accept connection result:", result);
        } catch (err) {
            console.error("Error accept connection requests:", err);
            setError("Failed to accept request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRejectConnection = async (connectionId) => {
        try {
            setLoading(true);
            setError("");

            const result = await axios.put(
                `${serverUrl}/v1/api/connection/reject/${connectionId}`,
                {},
                { withCredentials: true }
            );
            setConnections((prevConnections) =>
                prevConnections.filter((request) => request._id !== connectionId)
            );
            console.log("Reject connection result:", result);
        } catch (err) {
            console.error("Error reject connection requests:", err);
            setError("Failed to Reject request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f2ef]">
            <Nav />

            <main className="max-w-6xl mx-auto px-4 py-8 mt-[40px]">
                {/* Invitations heading */}
                <section className="bg-white rounded-lg shadow-sm px-5 py-7 mb-7">
                    <h1 className="text-xl font-medium text-gray-800">
                        Invitations {connections.length}
                    </h1>
                </section>

                {/* Invitation list */}
                <section className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                        <p className="p-6 text-gray-500">
                            Loading invitations...
                        </p>
                    ) : error ? (
                        <div className="p-6">
                            <p className="text-red-600">{error}</p>
                            <button
                                onClick={handleNetworkConnections}
                                className="mt-3 text-blue-600 font-medium"
                            >
                                Try again
                            </button>
                        </div>
                    ) : connections.length === 0 ? (
                        <p className="p-6 text-gray-500">
                            No pending invitations.
                        </p>
                    ) : (
                        connections.map((request) => {
                            const user = request.sender;

                            if (!user) return null;

                            const fullName =
                                `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                                user.userName ||
                                "Unknown User";

                            return (
                                <div
                                    key={request._id}
                                    className="flex items-center justify-between gap-4 px-5 py-5 border-b border-gray-100"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={
                                                user.profileImage ||
                                                "https://placehold.co/100x100?text=User"
                                            }
                                            alt={fullName}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />

                                        <div className="min-w-0">
                                            <h2 className="font-semibold text-gray-800">
                                                {fullName}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                {user.headline || "Member"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <button
                                            type="button"
                                            title="Accept invitation"
                                            className="text-cyan-600 hover:text-cyan-800"
                                            onClick={() =>
                                                handleAcceptConnection(request._id)
                                            }
                                        >
                                            <IoCheckmarkCircleOutline size={38} />
                                        </button>

                                        <button
                                            type="button"
                                            title="Reject invitation"
                                            className="text-red-700 hover:text-red-900"
                                            onClick={() =>
                                                handleRejectConnection(request._id)
                                            }
                                        >
                                            <IoCloseCircleOutline size={38} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </section>
            </main>
        </div>
    );
}

export default Network;

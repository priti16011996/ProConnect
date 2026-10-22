
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContextData } from "../context/AuthContext";
import profile from "../assets/profile.png";
import ConnectionBtn from "./ConnectionBtn";
import { IoEyeOutline } from "react-icons/io5";

function SuggestedUsers() {
    const { serverUrl } = useContext(AuthContextData);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const response = await axios.get(
                    `${serverUrl}/v1/api/user/suggested`,
                    { withCredentials: true }
                );

                setUsers(response.data.users || []);
            } catch (error) {
                console.error("Error fetching suggested users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestedUsers();
    }, [serverUrl]);

    return (
        <section className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-900">
                Suggested Users
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-4">
                People you may know
            </p>

            {loading ? (
                <p className="text-sm text-gray-500">
                    Loading suggestions...
                </p>
            ) : users.length === 0 ? (
                <p className="text-sm text-gray-500">
                    No new users to suggest.
                </p>
            ) : (
                <div className="space-y-4">
                    {users.map((person) => (
                        <div
                            key={person._id}
                            className="flex items-center justify-between gap-3"
                        >
                            {/* Left: Profile image and user information */}
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <img
                                    src={person.profileImage || profile}
                                    alt={person.firstName || "User"}
                                    onClick={() =>
                                        navigate(`/profile/${person._id}`)
                                    }
                                    className="w-12 h-12 rounded-full
                                        object-cover cursor-pointer shrink-0"
                                />

                                <div
                                    className="min-w-0 cursor-pointer"
                                    onClick={() =>
                                        navigate(`/profile/${person._id}`)
                                    }
                                >
                                    <h3 className="font-semibold text-sm
                                        text-gray-900 hover:underline truncate">
                                        {person.firstName} {person.lastName}
                                    </h3>

                                    <p className="text-xs text-gray-500 truncate">
                                        {person.headline ||
                                            person.userName ||
                                            "ProConnect member"}
                                    </p>
                                </div>
                            </div>

                            {/* Right: View Profile button */}
                            {/* Right side: Connection and Profile actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                <ConnectionBtn userId={person._id} />

                                <button
                                    type="button"
                                    onClick={() => navigate(`/profile/${person._id}`)}
                                    className="rounded-full border border-sky-600
            px-3 py-1.5 text-sm font-medium text-sky-700
            hover:bg-sky-50 transition-colors"
                                    title="View Profile">
                                    <IoEyeOutline />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default SuggestedUsers;

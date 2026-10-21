
import React, { useContext, useState, useEffect } from "react";
import Nav from "./Nav";
import { AuthContextData } from "../context/AuthContext";
import { userContextData } from "../context/UserContext";
import { FaCamera, FaPen } from "react-icons/fa";
import EditProfile from "./EditProfile";
import MyPost from "./MyPost";
import { useParams } from "react-router-dom";
import axios from "axios";
import ConnectionBtn from "./ConnectionBtn";


function Profile() {
    const { userId: profileId } = useParams();

    const { serverUrl } = useContext(AuthContextData);
    const { userData, edit, setEdit } = useContext(userContextData);

    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const fetchProfile = async () => {
            setLoading(true);
            setError("");

            try {
                if (!profileId) {
                    if (!cancelled) {
                        setProfileUser(userData?.user || null);
                    }
                    return;
                }

                const response = await axios.get(
                    `${serverUrl}/v1/api/user/${profileId}`,
                    { withCredentials: true }
                );

                if (!cancelled) {
                    setProfileUser(response.data.user);
                }
            } catch (err) {
                if (!cancelled) {
                    setProfileUser(null);
                    setError("Unable to load this profile.");
                }
                console.error("Error fetching profile:", err);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            cancelled = true;
        };
    }, [profileId, serverUrl, userData?.user]);

    if (loading) {
        return <div className="p-6">Loading profile...</div>;
    }

    if (error || !profileUser) {
        return (
            <div className="p-6">
                {error || "Profile not found."}
            </div>
        );
    }

    const user = profileUser;

    const isOwnProfile =
        String(user._id) === String(userData?.user?._id);
    const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.userName ||
        "Your Name";

    return (
        <div className="min-h-screen bg-[#f3f2ef]">
            <Nav />

            <main className="max-w-[1000px] mx-auto px-4 py-6 mt-[70px]">
                <section className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Cover image */}
                    <div className="relative h-40 sm:h-52 bg-gray-900">
                        <img
                            src={
                                user.coverImage ||
                                "https://placehold.co/1200x300/111111/84cc16?text=YOUR+COVER"
                            }
                            alt="Profile cover"
                            className="w-full h-full object-cover"
                        />

                        <button
                            type="button"
                            title="Edit cover image"
                            className="absolute top-4 right-4 bg-white rounded-full p-3 shadow hover:bg-gray-100"
                        >
                            <FaCamera className="text-gray-700" />
                        </button>
                    </div>

                    {/* Profile details */}
                    <div className="px-5 sm:px-8 pb-8">
                        {/* Avatar */}
                        <div className="relative -mt-14 sm:-mt-16 mb-3 w-fit">
                            <img
                                src={
                                    user.profileImage ||
                                    "https://placehold.co/140x140?text=User"
                                }
                                alt={fullName}
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white bg-white"
                            />

                            <button
                                type="button"
                                title="Edit profile photo"
                                className="absolute bottom-1 right-1 bg-white rounded-full p-2 shadow"
                            >
                                <FaCamera className="text-sky-600" />
                            </button>
                        </div>

                        {/* Edit profile button */}
                        {isOwnProfile && (
                            <button
                                type="button"
                                onClick={() => setEdit(true)}
                                className="flex items-center gap-2 px-5 py-2 rounded-full
                   border border-sky-600 text-sky-700 font-medium"
                            >
                                Edit Profile
                                <FaPen size={13} />
                            </button>
                        )}


                        {/* User information */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {fullName}
                            </h1>

                            <p className="mt-1 text-base text-gray-700">
                                {user.headline || "Add your professional headline"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                {user.location || "Add your location"}
                            </p>

                            <p className="mt-2 text-sm font-medium text-gray-600 mb-2">
                                {user.connections?.length || 0} connections
                            </p>
                        </div>
                    </div>
                </section>

                {/* Additional profile sections */}
                <section className="bg-white rounded-lg shadow-sm p-6 mt-5">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Headline
                    </h2>
                    <p className="text-gray-600 mt-3">
                        {user.headline || "Add a summary to introduce yourself."}
                    </p>
                </section>
                {/* Additional Skills sections */}
                <section className="bg-white rounded-lg shadow-sm p-6 mt-5">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Skills
                    </h2>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {user.skills && user.skills.length > 0 ? (
                            (Array.isArray(user.skills)
                                ? user.skills
                                : user.skills.split(",")
                            ).map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 
                    rounded-full text-sm font-medium border border-gray-200
                    hover:bg-blue-50 hover:text-blue-700 
                    hover:border-blue-200 transition-colors"
                                >
                                    {skill.trim()}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No skills added yet.
                            </p>
                        )}
                    </div>
                </section>
                {/* Experience Section */}
                <section className="bg-white rounded-lg shadow-sm p-6 mt-5">
                    <h2 className="text-xl font-semibold text-gray-900 mb-5">
                        Experience
                    </h2>

                    {user.experience?.length > 0 ? (
                        <div className="space-y-6">
                            {user.experience.map((exp, index) => (
                                <div key={exp._id || index} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-50
                        flex items-center justify-center shrink-0">
                                        <span className="text-blue-700 font-bold text-lg">
                                            {exp.company?.charAt(0)?.toUpperCase() || "C"}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-gray-900">
                                            {exp.title}
                                        </h3>

                                        <p className="text-gray-700 text-sm mt-1">
                                            {exp.company}
                                        </p>

                                        {exp.description && (
                                            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            No experience added yet.
                        </p>
                    )}
                </section>
                {/* Education Section */}
                <section className="bg-white rounded-lg shadow-sm p-6 mt-5">
                    <h2 className="text-xl font-semibold text-gray-900 mb-5">
                        Education
                    </h2>

                    {user.education?.length > 0 ? (
                        <div className="space-y-6">
                            {user.education.map((edu, index) => (
                                <div key={edu._id || index} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-purple-50
                        flex items-center justify-center shrink-0">
                                        <span className="text-purple-700 font-bold text-lg">
                                            {edu.college?.charAt(0)?.toUpperCase() || "E"}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-gray-900">
                                            {edu.college}
                                        </h3>

                                        <p className="text-gray-700 text-sm mt-1">
                                            {edu.degree}
                                        </p>

                                        {edu.fieldOfStudy && (
                                            <p className="text-gray-600 text-sm mt-1">
                                                {edu.fieldOfStudy}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            No education added yet.
                        </p>
                    )}
                </section>
                <MyPost
                    userId={user._id}
                    serverUrl={serverUrl}
                />

            </main>

            {/* Temporary edit dialog */}
            {isOwnProfile && edit && <EditProfile />}
        </div>
    );
}

export default Profile;

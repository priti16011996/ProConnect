import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Nav from "./Nav";
import PostCard from "./PostCard";
import { AuthContextData } from "../context/AuthContext";

function ViewPost() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { serverUrl } = useContext(AuthContextData);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                setError("");
                setPost(null);

                const response = await axios.get(
                    `${serverUrl}/v1/api/post/${postId}`,
                    { withCredentials: true }
                );

                setPost(response.data.post);
            } catch (err) {
                console.error("Error fetching post:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load this post."
                );
            } finally {
                setLoading(false);
            }
        };

        if (postId && serverUrl) {
            fetchPost();
        }
    }, [postId, serverUrl]);

    return (
        <div className="min-h-screen bg-[#f3f2ef]">
            <Nav />

            <main className="max-w-2xl mx-auto px-4 py-6 mt-10">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-4 text-blue-600 font-medium hover:underline"
                >
                    ← Back
                </button>

                {loading ? (
                    <p className="text-gray-500">
                        Loading post...
                    </p>
                ) : error ? (
                    <section className="bg-white rounded-lg p-6 shadow-sm">
                        <p className="text-red-600">{error}</p>

                        <button
                            onClick={() => navigate(-1)}
                            className="mt-3 text-blue-600"
                        >
                            Go back
                        </button>
                    </section>
                ) : post ? (
                    <PostCard post={post} />
                ) : (
                    <p className="text-gray-500">
                        Post not found.
                    </p>
                )}
            </main>
        </div>
    );
}

export default ViewPost;
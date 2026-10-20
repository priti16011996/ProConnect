import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function MyPosts({ userId, serverUrl }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleViewPost = (postId) => {
        navigate(`/post/${postId}`);
    };
    useEffect(() => {
        if (!userId) return;

        const fetchMyPosts = async () => {
            try {
                setLoading(true);

                // Replace with your actual backend endpoint.
                const response = await axios.get(
                    `${serverUrl}/v1/api/post/user/${userId}`,
                    { withCredentials: true }
                );

                setPosts(response.data.posts || []);
            } catch (error) {
                console.error("Error fetching my posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyPosts();
    }, [userId, serverUrl]);


    if (loading) {
        return <p className="mt-5 text-gray-500">Loading posts...</p>;
    }

    return (
        <section className="bg-white rounded-lg shadow-sm p-6 mt-5">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold text-gray-900">
                    Activity
                </h2>
                <span className="text-sm text-gray-500">
                    {posts.length} posts
                </span>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-10">
                    <p className="font-medium text-gray-700">
                        No posts yet
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Your posts will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2
                                lg:grid-cols-3 gap-4">
                    {posts.map((post) => (
                        <article
                            key={post._id}
                            className="border border-gray-200 rounded-lg
                                       overflow-hidden hover:shadow-md
                                       transition-shadow"
                        >
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt="Post"
                                    className="w-full aspect-square
                                               object-cover"
                                />
                            )}

                            <div className="p-4">
                                <p className="text-sm text-gray-800
                                              line-clamp-3">
                                    {post.description}
                                </p>

                                <div className="flex justify-between
                                                items-center mt-4
                                                text-xs text-gray-500">
                                    <span>
                                        {post.like?.length || 0} likes
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleViewPost(post._id)
                                        }
                                        className="text-blue-600
                                                   font-medium"
                                    >
                                        View post
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default MyPosts;
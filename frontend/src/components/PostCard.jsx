
import React, { useState, useContext } from "react";

import moment from "moment";
import { userContextData } from '../context/UserContext';
import {
    FaRegCommentDots
} from "react-icons/fa";

import {
    RiShareForwardLine
} from "react-icons/ri";

import {
    FiSend
} from "react-icons/fi";

import profile from "../assets/profile.png";

import LikeButton from "./LikeButton";

import axios from "axios";

import { AuthContextData } from "../context/AuthContext";

import { useEffect } from "react";

import { socket } from "../socket.js";
import ConnectionBtn from "./ConnectionBtn.jsx";
import { useNavigate } from "react-router-dom";



function PostCard({ post }) {
    const { userData, setUserData } = useContext(userContextData);
    const navigate = useNavigate();

    const handleProfileClick = (clickedUserId) => {
        if (clickedUserId) {
            navigate(`/profile/${clickedUserId}`);
        }
    };
    // ==========================================
    // POST DESCRIPTION
    // ==========================================

    const [expanded, setExpanded] = useState(false);

    const description = post.description || "";

    const isLong = description.length > 200;

    const displayedDescription =
        expanded || !isLong
            ? description
            : description.slice(0, 200) + "...";


    // ==========================================
    // AUTH / SERVER
    // ==========================================

    const { serverUrl } = useContext(AuthContextData);


    // ==========================================
    // COMMENT STATE
    // ==========================================

    const [commentContent, setCommentContent] =
        useState("");

    const [commenting, setCommenting] =
        useState(false);

    const [commentCount, setCommentCount] =
        useState(post.comment?.length || 0);


    // ==========================================
    // SHOW COMMENTS
    // ==========================================

    const [showComments, setShowComments] =
        useState(false);

    const [comments, setComments] =
        useState(post.comment || []);

    const [loadingComments, setLoadingComments] =
        useState(false);

    const [showShareModal, setShowShareModal] = useState(false);
    const [sharing, setSharing] = useState(false);

    const currentUserId = userData?.user?._id;

    const [likeCount, setLikeCount] = useState(
        post.like?.length || 0
    );

    const [liked, setLiked] = useState(
        post.like?.some(
            (id) =>
                id?.toString() ===
                currentUserId?.toString()
        ) || false
    );
    useEffect(() => {
        const handleLikeUpdate = ({ postId, likes }) => {
            // Only update this particular post
            if (postId !== post._id) {
                return;
            }

            setLikeCount(likes.length);

            setLiked(
                likes.some(
                    (id) =>
                        id?.toString() ===
                        currentUserId?.toString()
                )
            );
        };


        socket.on("LikeUpdate", handleLikeUpdate);

        return () => {
            socket.off("LikeUpdate", handleLikeUpdate);
        };
    }, [post._id, currentUserId]);

    useEffect(() => {
        const handleCommentUpdate = ({
            postId,
            comment,
            commentCount,
        }) => {
            // Only handle this post's comments
            if (postId !== post._id) {
                return;
            }

            // Update comment count
            setCommentCount(commentCount);

            // Add new comment to current comments
            if (comment) {
                setComments((prevComments) => {
                    // Prevent duplicate comment
                    const alreadyExists = prevComments.some(
                        (item) => item._id === comment._id
                    );

                    if (alreadyExists) {
                        return prevComments;
                    }

                    return [...prevComments, comment];
                });
            }
        };

        socket.on("CommentUpdate", handleCommentUpdate);

        return () => {
            socket.off("CommentUpdate", handleCommentUpdate);
        };
    }, [post._id]);
    const handleShare = async () => {
        try {
            setSharing(true);

            const response = await axios.post(
                `${serverUrl}/v1/api/post/${post._id}/share`,
                {},
                {
                    withCredentials: true,
                }
            );

            console.log("Share response:", response.data);

            alert("Post shared successfully");

            setShowShareModal(false);

        } catch (error) {
            console.error(
                "Share post error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Failed to share post"
            );
        } finally {
            setSharing(false);
        }
    };
    const handleSharePost = async () => {
        try {
            setSharing(true);

            const response = await axios.post(
                `${serverUrl}/v1/api/post/${post._id}/share`,
                {},
                {
                    withCredentials: true
                }
            );

            console.log("Share response:", response.data);

            // setShowShareModal(false);

            //alert("Post shared successfully");

        } catch (error) {

            console.log(
                "Share post error:",
                error
            );

            if (error.response?.status === 409) {
                alert("You have already shared this post");
            } else {
                alert("Failed to share post");
            }

        } finally {
            setSharing(false);
        }
    };

    // ==========================================
    // GET ALL COMMENTS
    // ==========================================

    const fetchComments = async () => {

        try {

            setLoadingComments(true);

            const response = await axios.get(
                `${serverUrl}/v1/api/post/${post._id}/comment`,
                {
                    withCredentials: true
                }
            );

            console.log(
                "Comments response:",
                response.data
            );

            /*
                Adjust this according to your
                backend response structure.
            
                Example:
            
                response.data.comments
            
                or
            
                response.data.data
            */

            setComments(
                response.data.comments || []
            );

        } catch (error) {

            console.log(
                "Get comments error:",
                error
            );

        } finally {

            setLoadingComments(false);

        }
    };


    // ==========================================
    // COMMENT BUTTON
    // ==========================================

    const handleCommentClick = async () => {

        const newState = !showComments;

        setShowComments(newState);

        // Fetch comments only when opening
        if (newState) {
            await fetchComments();
        }
    };


    // ==========================================
    // CREATE COMMENT
    // ==========================================

    const handleComment = async (e) => {
        e.preventDefault();

        if (!commentContent.trim()) {
            return;
        }

        try {
            setCommenting(true);

            const response = await axios.post(
                `${serverUrl}/v1/api/post/${post._id}/comment`,
                {
                    content: commentContent.trim()
                },
                {
                    withCredentials: true
                }
            );

            console.log(
                "Comment response:",
                response.data
            );

            // Socket will update:
            // - comments
            // - commentCount

            setCommentContent("");

            setShowComments(true);

        } catch (error) {

            console.log(
                "Comment error:",
                error.response?.data || error
            );

        } finally {
            setCommenting(false);
        }
    };


    return (

        <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">


            {/* ==========================================
                AUTHOR
            ========================================== */}

            <div className="flex items-center gap-3 p-4">

                <img
                    src={
                        post.author?.profileImage ||
                        profile
                    }
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover"
                    onClick={() => handleProfileClick(post.author._id)}
                />

                <div className="flex-1">

                    <h3 className="font-semibold">

                        {post.author?.firstName}{" "}

                        {post.author?.lastName}

                    </h3>

                    <p className="text-sm text-gray-500">

                        {post.author?.headline}

                    </p>

                    <p className="text-xs text-gray-400">

                        {moment(post.createdAt).fromNow()}

                        {" · Public"}

                    </p>

                </div>
                {userData?.user?._id != post?.author?._id && <ConnectionBtn userId={post?.author?._id} />}
            </div>


            {/* ==========================================
                DESCRIPTION
            ========================================== */}

            {description && (

                <div className="px-4 pb-3">

                    <p className="text-gray-800 whitespace-pre-wrap">

                        {displayedDescription}

                    </p>


                    {isLong && (

                        <button
                            type="button"
                            onClick={() =>
                                setExpanded(!expanded)
                            }
                            className="font-semibold text-gray-600 hover:underline mt-1"
                        >

                            {expanded
                                ? "Show less"
                                : "Read more"}

                        </button>

                    )}

                </div>

            )}


            {/* ==========================================
                POST IMAGE
            ========================================== */}

            {post.image && (

                <div className="w-full">

                    <img
                        src={post.image}
                        alt="post"
                        className="w-full max-h-[600px] object-cover"
                    />

                </div>

            )}


            {/* ==========================================
                LIKE / COMMENT COUNTS
            ========================================== */}

            <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-500">

                <span>
                    {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                </span>


                <span>

                    {commentCount}

                    {" "}

                    {commentCount === 1
                        ? "Comment"
                        : "Comments"}

                </span>

            </div>


            {/* ==========================================
                DIVIDER
            ========================================== */}

            <div className="border-t" />


            {/* ==========================================
                ACTION BUTTONS
            ========================================== */}

            <div className="flex items-center border-t px-2">


                {/* LIKE */}

                <LikeButton
                    post={post}
                    liked={liked}
                    setLiked={setLiked}
                    setLikeCount={setLikeCount}
                    likeCount={likeCount}
                />


                {/* COMMENT */}

                <button
                    type="button"
                    onClick={handleCommentClick}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-gray-600 hover:bg-gray-100 ${showComments
                        ? "bg-gray-100"
                        : ""
                        }`}
                >

                    <FaRegCommentDots
                        className="text-xl"
                    />

                    <span>
                        Comment
                    </span>

                </button>


                {/* SHARE */}

                <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-gray-600 hover:bg-gray-100"
                    onClick={() => setShowShareModal(true)} >

                    <RiShareForwardLine
                        className="text-xl"
                    />

                    <span>
                        Share
                    </span>

                </button>

            </div>


            {/* ==========================================
                COMMENT INPUT
            ========================================== */}
            {showComments && (
                <div className="flex items-center gap-3 px-4 py-3 border-t">

                    <form
                        onSubmit={handleComment}
                        className="flex items-center w-full gap-2"
                    >

                        <img
                            src={userData?.user?.profileImage || profile}
                            alt="profile"
                            className="w-8 h-8 rounded-full object-cover"
                        />


                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentContent}
                            onChange={(e) =>
                                setCommentContent(
                                    e.target.value
                                )
                            }
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none"
                        />


                        <button
                            type="submit"
                            disabled={
                                !commentContent.trim() ||
                                commenting
                            }
                            className="flex items-center justify-center text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >

                            {commenting ? (

                                <span className="text-sm">
                                    Posting...
                                </span>

                            ) : (

                                <FiSend
                                    className="w-[25px] h-[25px]"
                                />

                            )}

                        </button>

                    </form>

                </div>
            )}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

                    <div className="bg-white w-full max-w-md rounded-xl shadow-xl">

                        {/* HEADER */}
                        <div className="flex items-center justify-between px-5 py-4 border-b">

                            <h2 className="text-lg font-semibold">
                                Share post
                            </h2>

                            <button
                                type="button"
                                onClick={() => setShowShareModal(false)}
                                className="text-gray-500 hover:text-black text-xl"
                            >
                                ×
                            </button>

                        </div>

                        {/* OPTIONS */}
                        <div className="p-4">

                            <button
                                type="button"
                                onClick={handleShare}
                                disabled={sharing}
                                className="w-full flex items-center gap-4 px-4 py-4 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                            >

                                <RiShareForwardLine className="text-2xl" />

                                <div className="text-left">
                                    <p className="font-semibold">
                                        {sharing ? "Sharing..." : "Repost"}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Share this post with your network
                                    </p>
                                </div>

                            </button>

                        </div>

                    </div>

                </div>
            )}

            {post.sharedPost && (
                <div className="px-4 pb-3">

                    <div className="border rounded-lg overflow-hidden">

                        {/* ORIGINAL POST AUTHOR */}
                        <div className="flex items-center gap-3 p-3">

                            <img
                                src={
                                    post.sharedPost.author?.profileImage ||
                                    profile
                                }
                                alt="profile"
                                className="w-10 h-10 rounded-full object-cover"
                            />

                            <div>

                                <p className="font-semibold">
                                    {post.sharedPost.author?.firstName}{" "}
                                    {post.sharedPost.author?.lastName}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {post.sharedPost.author?.headline}
                                </p>

                            </div>

                        </div>

                        {/* ORIGINAL DESCRIPTION */}
                        {post.sharedPost.description && (
                            <p className="px-3 pb-3 text-gray-800 whitespace-pre-wrap">
                                {post.sharedPost.description}
                            </p>
                        )}

                        {/* ORIGINAL IMAGE */}
                        {post.sharedPost.image && (
                            <img
                                src={post.sharedPost.image}
                                alt="shared post"
                                className="w-full max-h-[500px] object-cover"
                            />
                        )}

                    </div>

                </div>
            )}

            {/* ==========================================
                ALL COMMENTS
            ========================================== */}

            {showComments && (

                <div className="border-t px-4 py-3 bg-gray-50 max-h-[200px] overflow-scroll overflow-x-hidden">


                    {/* LOADING */}

                    {loadingComments ? (

                        <div className="text-center text-sm text-gray-500 py-4">

                            Loading comments...

                        </div>

                    ) : comments.length == 0 ? (

                        <div className="text-center text-sm text-gray-500 py-4">

                            No comments yet.

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {comments.map((comment) => (

                                <div
                                    key={comment._id}
                                    className="flex gap-3"
                                >


                                    {/* COMMENT USER IMAGE */}

                                    <img
                                        src={
                                            comment.user?.profileImage ||
                                            profile
                                        }
                                        alt="profile"
                                        className="w-9 h-9 rounded-full object-cover"
                                    />

                                    {/* COMMENT CONTENT */}

                                    <div className="flex-1">

                                        <div className="bg-white rounded-lg px-3 py-2 shadow-sm">

                                            <p className="font-semibold text-sm">

                                                {comment.user?.firstName ||
                                                    "User"}

                                                {" "}

                                                {comment.user?.lastName ||
                                                    ""}

                                            </p>


                                            <p className="text-sm text-gray-700 mt-1">

                                                {comment.content}

                                            </p>


                                        </div>


                                        {/* COMMENT DATE */}

                                        <p className="text-xs text-gray-400 mt-1 ml-2">

                                            {comment.createdAt
                                                ? moment(
                                                    comment.createdAt
                                                ).fromNow()
                                                : ""}

                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            )}



        </div>
    );
}


export default PostCard;


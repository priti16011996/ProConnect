
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


function PostCard({ post }) {
    const { userData, setUserData } = useContext(userContextData);
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


            /*
                Depending on your backend,
                newly created comment may be:
    
                response.data.comment
    
                Change this if needed.
            */

            const newComment =
                response.data.comment;


            // Add new comment immediately
            if (newComment) {

                setComments((prev) => [
                    ...prev,
                    newComment
                ]);

            }


            // Increase count
            setCommentCount(
                (prev) => prev + 1
            );


            // Clear input
            setCommentContent("");


            // Automatically show comments
            setShowComments(true);


        } catch (error) {

            console.log(
                "Comment error:",
                error
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

                    {post.like?.length || 0}

                    {" "}

                    {post.like?.length === 1
                        ? "Like"
                        : "Likes"}

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
                >

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

                    ) : comments.length === 0 ? (

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


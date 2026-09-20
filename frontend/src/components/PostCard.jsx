import React, { useState } from "react";

import moment from "moment";

import {
    AiOutlineLike
} from "react-icons/ai";

import {
    FaRegCommentDots
} from "react-icons/fa";

import {
    RiShareForwardLine
} from "react-icons/ri";

import profile from "../assets/profile.png";


function PostCard({ post }) {

    const [expanded, setExpanded] =
        useState(false);


    const description =
        post.description || "";

    const isLong =
        description.length > 200;


    const displayedDescription =
        expanded || !isLong
            ? description
            : description.slice(0, 200) + "...";


    return (

        <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">

            {/* AUTHOR */}

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


            {/* DESCRIPTION */}

            {description && (

                <div className="px-4 pb-3">

                    <p className="text-gray-800 whitespace-pre-wrap">

                        {displayedDescription}

                    </p>


                    {isLong && (

                        <button
                            onClick={() =>
                                setExpanded(
                                    !expanded
                                )
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


            {/* IMAGE */}

            {post.image && (

                <div className="w-full">

                    <img
                        src={post.image}
                        alt="post"
                        className="w-full max-h-[600px] object-cover"
                    />

                </div>

            )}


            {/* COUNTS */}

            <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-500">

                <span>

                    {post.like?.length || 0}

                    {" "}

                    {post.like?.length === 1
                        ? "Like"
                        : "Likes"}

                </span>


                <span>

                    {post.comment?.length || 0}

                    {" "}

                    {post.comment?.length === 1
                        ? "Comment"
                        : "Comments"}

                </span>

            </div>


            <div className="border-t" />


            {/* ACTIONS */}

            <div className="flex items-center border-t px-2">

                <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-gray-600 hover:bg-gray-100"
                >
                    <AiOutlineLike className="text-xl" />
                    <span>Like</span>
                </button>


                <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-gray-600 hover:bg-gray-100"
                >
                    <FaRegCommentDots className="text-xl" />
                    <span>Comment</span>
                </button>


                <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-gray-600 hover:bg-gray-100"
                >
                    <RiShareForwardLine className="text-xl" />
                    <span>Share</span>
                </button>

            </div>

        </div>
    );
}

export default PostCard;
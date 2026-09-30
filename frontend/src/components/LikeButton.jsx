import React, { useState, useContext } from "react";

import { AiOutlineLike } from "react-icons/ai";

import axios from "axios";

import { AuthContextData } from "../context/AuthContext";


function LikeButton({
    post,
    liked,
    setLiked,
    setLikeCount,
    likeCount
}) {

    const { serverUrl } =
        useContext(AuthContextData);

    const [loading, setLoading] =
        useState(false);


    const handleLike = async () => {

        if (loading) {
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                `${serverUrl}/v1/api/post/${post._id}/like`,
                {},
                {
                    withCredentials: true
                }
            );

            console.log(
                "Like response:",
                response.data
            );


            // Update liked state
            setLiked(
                response.data.liked
            );


            // Update count
            setLikeCount(
                response.data.likeCount
            );


        } catch (error) {

            console.log(
                "Like error:",
                error.response?.data || error
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <button
            type="button"
            onClick={handleLike}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 py-3 transition
                ${liked
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-100"
                }
            `}
        >

            <AiOutlineLike
                className={`text-xl ${liked
                    ? "text-blue-600"
                    : "text-gray-600"
                    }`}
            />

            <span>
                {likeCount === 1 ? "Like" : "Likes"}({likeCount})
            </span>

        </button>
    );
}

export default LikeButton;
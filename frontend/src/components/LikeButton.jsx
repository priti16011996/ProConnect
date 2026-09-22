import React, {
    useState,
    useContext,
    useEffect
} from "react";

import {
    AiOutlineLike
} from "react-icons/ai";

import axios from "axios";

import {
    AuthContextData
} from "../context/AuthContext";


function LikeButton({ post }) {

    const {
        serverUrl,
        userData
    } = useContext(AuthContextData);


    // ==========================================
    // CURRENT USER
    // ==========================================

    const currentUserId =
        userData?.user?._id;


    // ==========================================
    // LIKE STATE
    // ==========================================

    const [liked, setLiked] =
        useState(false);

    const [likeCount, setLikeCount] =
        useState(
            post.like?.length || 0
        );

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // CHECK LIKE AFTER POST / USER LOADS
    // ==========================================

    useEffect(() => {

        if (!currentUserId) {
            return;
        }

        const alreadyLiked =
            post.like?.some(
                (userId) =>
                    userId?.toString() ===
                    currentUserId?.toString()
            ) || false;

        setLiked(alreadyLiked);

    }, [
        post.like,
        currentUserId
    ]);


    // ==========================================
    // KEEP COUNT UPDATED
    // ==========================================

    useEffect(() => {

        setLikeCount(
            post.like?.length || 0
        );

    }, [
        post.like
    ]);


    // ==========================================
    // LIKE / UNLIKE
    // ==========================================

    const handleLike = async () => {

        if (loading) {
            return;
        }

        try {

            setLoading(true);

            const response =
                await axios.post(
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


            setLiked(
                response.data.liked
            );

            setLikeCount(
                response.data.likeCount
            );


        } catch (error) {

            console.log(
                "Like error:",
                error
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
                Like ({likeCount})
            </span>

        </button>

    );
}


export default LikeButton;
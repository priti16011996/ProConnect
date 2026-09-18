import React, { useContext, useState, useRef, useEffect } from "react";
import Nav from "../components/Nav";
import { GoPlusCircle } from "react-icons/go";
import { userContextData } from "../context/UserContext";
import { CiCamera } from "react-icons/ci";
import { BsPencil } from "react-icons/bs";
import EditProfile from "../components/EditProfile";
import profile from "../assets/profile.png";
import { RxCross1 } from "react-icons/rx";
import { IoImageOutline } from "react-icons/io5";
import { AuthContextData } from "../context/AuthContext.jsx";
import axios from "axios";
import moment from "moment";
import {
    AiOutlineLike,
    AiFillLike
} from "react-icons/ai";
import {
    FaRegCommentDots
} from "react-icons/fa";
import {
    RiShareForwardLine
} from "react-icons/ri";

function Home() {
    const {
        userData,
        edit,
        setEdit
    } = useContext(userContextData);

    // Post modal state
    const [showPostModal, setShowPostModal] = useState(false);

    // Post image states
    const [frontendPostImage, setFrontendPostImage] = useState("");
    const [backendPostImage, setBackendPostImage] = useState(null);

    // Post description
    const [description, setDescription] = useState("");

    const image = useRef();
    const loadMoreRef = useRef(null);

    const [posts, setPosts] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);

    let { serverUrl } = useContext(AuthContextData);

    const [posting, setPosting] = useState(false);
    const [expandedPosts, setExpandedPosts] = useState({});
    const getPost = async (cursor = null) => {
        try {
            if (loadingPosts || (!hasMore && cursor)) {
                return;
            }

            setLoadingPosts(true);

            let url = `${serverUrl}/v1/api/post/getPost?limit=10`;

            if (cursor) {
                url += `&cursor=${encodeURIComponent(cursor)}`;
            }

            const result = await axios.get(url, {
                withCredentials: true
            });

            const newPosts = result.data.posts;

            if (cursor) {
                // Load more
                setPosts((prevPosts) => [
                    ...prevPosts,
                    ...newPosts
                ]);
            } else {
                // Initial load
                setPosts(newPosts);
            }

            setNextCursor(
                result.data.pagination.nextCursor
            );

            setHasMore(
                result.data.pagination.hasMore
            );

        } catch (error) {
            console.log("Get post error:", error);
        } finally {
            setLoadingPosts(false);
        }
    };

    useEffect(() => {
        getPost();
    }, [serverUrl]);

    useEffect(() => {

        const observer = new IntersectionObserver(
            (entries) => {

                const target = entries[0];

                if (
                    target.isIntersecting &&
                    hasMore &&
                    !loadingPosts &&
                    nextCursor
                ) {
                    getPost(nextCursor);
                }
            },
            {
                root: null,
                rootMargin: "200px",
                threshold: 0
            }
        );

        const currentRef = loadMoreRef.current;

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };

    }, [nextCursor, hasMore, loadingPosts]);

    function handleImage(e) {
        const file = e.target.files[0];

        if (!file) return;

        setBackendPostImage(file);
        setFrontendPostImage(URL.createObjectURL(file));
    }

    const handleClosePostModal = () => {

        setShowPostModal(false);

        // Clear post data
        setDescription("");
        setFrontendPostImage("");
        setBackendPostImage(null);

        // Clear file input
        if (image.current) {
            image.current.value = "";
        }
    }

    const handlePost = async (e) => {
        try {
            setPosting(true);
            e.preventDefault();
            let formdata = new FormData();
            formdata.append("description", description);
            if (backendPostImage) {
                formdata.append("image", backendPostImage);
            }
            let result = await axios.post(`${serverUrl}/v1/api/post/create`, formdata, { withCredentials: true });
            handleClosePostModal()
            console.log(result);


        } catch (error) {
            console.log(error);
        }
        finally {
            setPosting(false);
        }
    }

    return (
        <div className="relative w-full min-h-screen bg-[#E5E4E2] flex justify-center items-start gap-[20px] px-[20px] flex-col lg:flex-row">

            {/* Edit Profile Popup */}
            {edit && <EditProfile />}

            {/* Navbar */}
            <Nav />

            {/* Left Section */}
            <div className="w-full lg:w-[25%] min-h-[300px] bg-white shadow-lg mt-[80px] p-3 relative">

                {/* Cover */}
                <div
                    className="w-full h-[20vh] bg-[#838383] relative"
                    onClick={() => setEdit(true)}
                >
                    <CiCamera
                        className="absolute right-[15px] top-[15px] w-[25px] h-[25px] cursor-pointer text-white"
                    />

                    <img
                        src={userData?.user?.coverImage || ""}
                        className="w-full h-[20vh] object-cover"
                        alt="cover"
                    />
                </div>

                {/* Profile Image */}
                <div
                    className="absolute rounded-full bg-[#ded8d8] w-[90px] h-[90px] top-[110px] left-[30px] border-4 border-white"
                    onClick={() => setEdit(true)}
                >
                    <img
                        src={userData?.user?.profileImage || profile}
                        className="w-full h-full rounded-full object-cover"
                        alt="profile"
                    />
                </div>

                {/* Plus Icon */}
                <GoPlusCircle
                    className="absolute left-[100px] top-[150px] bg-[#438ac8] rounded-full text-white w-[22px] h-[22px]"
                />

                {/* User Name */}
                <div className="mt-[55px] ml-[27px]">
                    <span className="font-semibold text-lg">
                        {userData?.user?.firstName}{" "}
                        {userData?.user?.lastName}
                    </span>
                </div>

                {/* Headline */}
                <div className="ml-[27px] mt-1">
                    <span className="text-gray-500">
                        {userData?.user?.headline}
                    </span>
                </div>

                {/* Location */}
                <div className="ml-[27px] mt-1">
                    <span className="text-gray-500">
                        {userData?.user?.location}
                    </span>
                </div>

                {/* Edit Profile */}
                <div className="mt-[30px]">
                    <button
                        onClick={() => setEdit(true)}
                        className="flex justify-center items-center w-full h-[40px] rounded-full border-2 border-[#a4ccdd] text-[#438ac8] hover:bg-[#eaf6fb] transition"
                    >
                        Edit Profile
                        <BsPencil className="ml-3" />
                    </button>
                </div>
            </div>

            {/* Middle Section */}
            <div className="w-full lg:w-[50%] min-h-[200px] lg:mt-[80px]">

                {/* Create Post */}
                <div className="w-full min-h-[100px] bg-white shadow-lg rounded p-3 flex justify-center items-center gap-[20px]">

                    <div className="rounded-full bg-[#ded8d8] w-12 h-12 border-4 border-white shrink-0">
                        <img
                            src={userData?.user?.profileImage || profile}
                            className="w-full h-full rounded-full object-cover"
                            alt="profile"
                        />
                    </div>

                    <button
                        onClick={() => setShowPostModal(true)}
                        className="flex justify-start p-3 items-center w-full h-[40px] rounded-full border-2 border-[#515253]"
                    >
                        Click Here to add new post
                    </button>

                </div>


                {/* POSTS */}
                <div className="mt-5 flex flex-col gap-5">

                    {posts.map((post) => {
                        const isExpanded = expandedPosts[post._id];

                        const description =
                            post.description || "";

                        const isLong = description.length > 200;

                        const displayedDescription =
                            isExpanded || !isLong
                                ? description
                                : description.slice(0, 200) + "...";

                        return (
                            <div
                                key={post._id}
                                className="w-full bg-white shadow-lg rounded-lg overflow-hidden"
                            >

                                {/* Author */}
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
                                            {moment(post.createdAt).fromNow()} · Public
                                        </p>

                                    </div>

                                </div>


                                {/* Description */}
                                {description && (
                                    <div className="px-4 pb-3">

                                        <p className="text-gray-800 whitespace-pre-wrap">
                                            {displayedDescription}
                                        </p>

                                        {isLong && (
                                            <button
                                                onClick={() =>
                                                    setExpandedPosts((prev) => ({
                                                        ...prev,
                                                        [post._id]: !isExpanded
                                                    }))
                                                }
                                                className="font-semibold text-gray-600 hover:underline mt-1"
                                            >
                                                {isExpanded
                                                    ? "Show less"
                                                    : "Read more"}
                                            </button>
                                        )}

                                    </div>
                                )}


                                {/* Post Image */}
                                {post.image && (
                                    <div className="w-full">

                                        <img
                                            src={post.image}
                                            alt="post"
                                            className="w-full max-h-[600px] object-cover"
                                        />

                                    </div>
                                )}


                                {/* Like / Comment Count */}
                                <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-500">

                                    <span>
                                        {post.like?.length || 0}{" "}
                                        {post.like?.length === 1
                                            ? "Like"
                                            : "Likes"}
                                    </span>

                                    <span>
                                        {post.comment?.length || 0}{" "}
                                        {post.comment?.length === 1
                                            ? "Comment"
                                            : "Comments"}
                                    </span>

                                </div>


                                {/* Divider */}
                                <div className="border-t"></div>


                                <div className="flex items-center border-t px-2">

                                    <button className="flex-1 flex items-center justify-center gap-2 py-3 text-gray-600 hover:bg-gray-100">
                                        <AiOutlineLike className="text-xl" />
                                        <span>Like</span>
                                    </button>

                                    <button className="flex-1 flex items-center justify-center gap-2 py-3 text-gray-600 hover:bg-gray-100">
                                        <FaRegCommentDots className="text-xl" />
                                        <span>Comment</span>
                                    </button>

                                    <button className="flex-1 flex items-center justify-center gap-2 py-3 text-gray-600 hover:bg-gray-100">
                                        <RiShareForwardLine className="text-xl" />
                                        <span>Share</span>
                                    </button>

                                </div>

                            </div>
                        );
                    })}

                </div>


                {/* LOADING SENTINEL */}
                <div
                    ref={loadMoreRef}
                    className="w-full flex justify-center py-6"
                >

                    {loadingPosts && (
                        <p className="text-gray-500">
                            Loading posts...
                        </p>
                    )}

                    {!hasMore && posts.length > 0 && (
                        <p className="text-gray-500">
                            No more posts
                        </p>
                    )}

                </div>

            </div>

            {/* Right Section */}
            <div className="w-full lg:w-[25%] min-h-[300px] bg-white shadow-lg lg:mt-[80px]">
            </div>

            {/* ================= POST MODAL ================= */}

            {showPostModal && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/50 z-[100]"
                        onClick={handleClosePostModal}
                    ></div>

                    {/* Modal */}
                    <div className="fixed w-[400px] max-w-[95%] min-h-[500px] bg-white rounded-lg z-[200] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl">

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            hidden
                            ref={image}
                            accept="image/*"
                            onChange={handleImage}
                        />

                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b">

                            <h2 className="font-semibold text-lg">
                                Create a post
                            </h2>

                            <button
                                type="button"
                                onClick={handleClosePostModal}
                                className="text-gray-600 hover:text-red-500 text-lg"
                            >
                                <RxCross1 />
                            </button>
                        </div>

                        {/* User Information */}
                        <div className="flex justify-start items-center p-3">

                            <div className="rounded-full bg-[#ded8d8] w-[60px] h-[60px] border-4 border-white">
                                <img
                                    src={userData?.user?.profileImage || profile}
                                    className="w-full h-full rounded-full object-cover"
                                    alt="profile"
                                />
                            </div>

                            <div className="ml-3">
                                <span className="font-semibold text-[19px]">
                                    {userData?.user?.firstName}{" "}
                                    {userData?.user?.lastName}
                                </span>
                            </div>

                        </div>

                        {/* Post Content */}
                        <div className="w-full p-3">

                            <textarea
                                className={`w-full ${frontendPostImage
                                    ? "h-[100px]"
                                    : "h-[220px]"
                                    } outline-none resize-none`}
                                placeholder="What do you want to talk about?"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                            />

                            {/* Image Preview */}
                            {frontendPostImage && (
                                <div className="w-full h-[180px] overflow-hidden rounded-lg relative">

                                    <img
                                        src={frontendPostImage}
                                        alt="post preview"
                                        className="w-full h-full object-cover"
                                    />

                                </div>
                            )}

                        </div>

                        {/* Bottom Actions */}
                        <div className="flex flex-col justify-start items-start gap-[10px] p-3">

                            <button
                                type="button"
                                className="w-[40px] h-[40px]"
                                onClick={() => image.current.click()}
                            >
                                <IoImageOutline className="w-[30px] h-[30px]" />
                            </button>

                            <div className="w-full h-[1px] bg-[#5e5e5e]"></div>

                        </div>

                        {/* Post Button */}
                        <div className="flex justify-end items-center p-3">

                            <button
                                type="button"
                                onClick={handlePost}
                                disabled={posting}
                                className="px-5 py-2 border-2 bg-[#438ac8] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {posting ? "Posting" : "Post"}
                            </button>

                        </div>

                    </div>
                </>
            )}

        </div>
    );
}

export default Home;
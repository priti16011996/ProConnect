import React, {
    useContext,
    useRef,
    useState
} from "react";

import axios from "axios";

import { RxCross1 } from "react-icons/rx";
import { IoImageOutline } from "react-icons/io5";

import { userContextData } from "../context/UserContext";
import { AuthContextData } from "../context/AuthContext";

import profile from "../assets/profile.png";

function CreatePostModal({ onClose }) {

    const { userData } = useContext(userContextData);
    const { serverUrl } = useContext(AuthContextData);

    const image = useRef();

    const [description, setDescription] = useState("");
    const [frontendPostImage, setFrontendPostImage] = useState("");
    const [backendPostImage, setBackendPostImage] = useState(null);

    const [posting, setPosting] = useState(false);


    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setBackendPostImage(file);

        setFrontendPostImage(
            URL.createObjectURL(file)
        );
    };


    const handlePost = async (e) => {

        e.preventDefault();

        try {

            setPosting(true);

            const formData = new FormData();

            formData.append(
                "description",
                description
            );

            if (backendPostImage) {

                formData.append(
                    "image",
                    backendPostImage
                );

            }

            await axios.post(
                `${serverUrl}/v1/api/post/create`,
                formData,
                {
                    withCredentials: true
                }
            );

            onClose();

            setDescription("");
            setFrontendPostImage("");
            setBackendPostImage(null);

        } catch (error) {

            console.log(
                "Create post error:",
                error
            );

        } finally {

            setPosting(false);

        }
    };


    return (

        <>
            {/* Overlay */}

            <div
                className="fixed inset-0 bg-black/50 z-[100]"
                onClick={onClose}
            />

            {/* Modal */}

            <div className="fixed w-[400px] max-w-[95%] min-h-[500px] bg-white rounded-lg z-[200] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl">

                {/* File input */}

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
                        onClick={onClose}
                        className="text-gray-600 hover:text-red-500 text-lg"
                    >
                        <RxCross1 />
                    </button>

                </div>


                {/* User */}

                <div className="flex items-center p-3">

                    <div className="rounded-full w-[60px] h-[60px]">

                        <img
                            src={
                                userData?.user?.profileImage ||
                                profile
                            }
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


                {/* Content */}

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

                    {frontendPostImage && (

                        <div className="w-full h-[180px] overflow-hidden rounded-lg">

                            <img
                                src={frontendPostImage}
                                alt="preview"
                                className="w-full h-full object-cover"
                            />

                        </div>

                    )}

                </div>


                {/* Image */}

                <div className="p-3">

                    <button
                        type="button"
                        onClick={() =>
                            image.current.click()
                        }
                    >
                        <IoImageOutline className="w-[30px] h-[30px]" />
                    </button>

                </div>


                {/* Post */}

                <div className="flex justify-end p-3">

                    <button
                        type="button"
                        onClick={handlePost}
                        disabled={posting}
                        className="px-5 py-2 border-2 bg-[#438ac8] text-white rounded-full"
                    >
                        {posting ? "Posting..." : "Post"}
                    </button>

                </div>

            </div>
        </>
    );
}

export default CreatePostModal;
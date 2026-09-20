import React, { useContext, useState } from "react";
import { userContextData } from "../context/UserContext";
import CreatePostModal from "./CreatePostModal";
import profile from "../assets/profile.png";

function CreatePost() {

    const { userData } = useContext(userContextData);

    const [showPostModal, setShowPostModal] = useState(false);

    return (
        <>
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

            {showPostModal && (
                <CreatePostModal
                    onClose={() => setShowPostModal(false)}
                />
            )}
        </>
    );
}

export default CreatePost;
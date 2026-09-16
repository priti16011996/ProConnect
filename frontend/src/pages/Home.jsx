import React, { useContext, useState, useRef } from "react";
import Nav from "../components/Nav";
import { GoPlusCircle } from "react-icons/go";
import { userContextData } from "../context/UserContext";
import { CiCamera } from "react-icons/ci";
import { BsPencil } from "react-icons/bs";
import EditProfile from "../components/EditProfile";
import profile from '../assets/profile.png'
import { RxCross1 } from "react-icons/rx";
import { IoImageOutline } from "react-icons/io5";

function Home() {
    const {
        userData,
        setUserData,
        edit,
        setEdit
    } = useContext(userContextData);
    const [frontendPostImage, setFrontendPostImage] = useState("");
    const [backendPostImage, setBackendPostImage] = useState("");
    const [description, setDescription] = useState("");
    const image = useRef();
    return (
        <div className="relative w-full min-h-screen bg-[#E5E4E2] flex justify-center items-start gap-[20px] px-[20px] flex-col lg:flex-row">

            {/* Edit Profile Popup */}
            {edit && <EditProfile />}

            {/* Navbar */}
            <Nav />

            {/* Left Section */}
            <div className="w-full lg:w-[25%] min-h-[300px] bg-white shadow-lg mt-[80px] p-3 relative">

                {/* Cover */}
                <div className="w-full h-[20vh] bg-[#838383] relative" onClick={() => setEdit(true)}>
                    <CiCamera
                        className="absolute right-[15px] top-[15px] w-[25px] h-[25px] cursor-pointer text-[white]"
                    />
                    <img src={userData?.user?.coverImage || ""} className=" w-full h-[20vh]" />
                </div>

                {/* Profile Image */}
                <div className="absolute rounded-full bg-[#ded8d8] w-[90px] h-[90px] top-[110px] left-[30px] border-4 border-white" onClick={() => setEdit(true)}>
                    <img src={userData?.user?.profileImage || profile} className="w-full h-full rounded-full object-cover" />
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
            <div className="absolute w-full h-[100vh] bg-[black] opacity-[0.5] left-0 z-[100]"></div>
            <div className="absolute w-[400px] h-[550px] bg-[white] mt-[80px] z-[200]">
                <input type="file" hidden ref={image} />
                <div className="flex justify-end items-center p-3">
                    <button
                        type="button"
                        className="text-red-500 font-bold text-lg "
                    >
                        <RxCross1 />
                    </button>
                </div>
                <div className="flex justify-start items-center">
                    {/* Profile Image */}
                    <div className="rounded-full bg-[#ded8d8] w-[60px] h-[60px]  border-4 border-white ml-3" >
                        <img src={userData?.user?.profileImage || profile} className="w-full h-full rounded-full object-cover" />
                    </div>
                    {/* User Name */}
                    <div className="ml-3">
                        <span className="font-semibold text-[19px]">
                            {userData?.user?.firstName}{" "}
                            {userData?.user?.lastName}
                        </span>
                    </div>

                </div>
                <div className="w-full p-3">
                    <textarea className="w-full h-[40vh] outline-none border-none resize-none bg-[#ffffff]" placeholder=" What do you want to talk about?"
                        onChange={(e) => { setDescription(e.target.value) }}></textarea>
                </div>

                <div className="flex flex-col justify-start items-start gap-[10px] p-3">
                    <div className="w-[40px] h-[40px]"><IoImageOutline className="w-[30px] h-[30px] " onClick={() => { image.current.click() }} /></div>
                    <div className=" w-full h-[1px] bg-[#949292]"></div>
                </div>
                <div className="flex justify-end items-start gap-[10px] p-3">
                    <button
                        type="submit"
                        className="px-5 py-2  border-2 bg-[#438ac8] text-[white] rounded-full">

                        Post
                    </button>
                </div>
            </div>
            {/* Middle Section */}
            <div className="w-full lg:w-[50%] min-h-[200px]  lg:mt-[80px]">

                <div className="w-full min-h-[100px] bg-white shadow-lg rounded p-3 flex justify-center items-center gap-[20px] ">
                    {/* Profile Image */}
                    <div className="rounded-full bg-[#ded8d8] w-12 h-12 border-4 border-white">
                        <img src={userData?.user?.profileImage || profile} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <button
                        className="flex justify-start p-3 items-center w-full h-[40px] rounded-full border-2 border-[#515253] text-[#333537] hover:bg-[#eaf6fb] transition"
                    >
                        Click Here to add new post


                    </button>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-[25%] min-h-[300px] bg-white shadow-lg lg:mt-[80px]">
            </div>

        </div >
    );
}

export default Home;
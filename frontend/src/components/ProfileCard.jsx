import React, { useContext } from "react";
import { GoPlusCircle } from "react-icons/go";
import { CiCamera } from "react-icons/ci";
import { BsPencil } from "react-icons/bs";

import { userContextData } from "../context/UserContext";
import profile from "../assets/profile.png";

function ProfileCard() {

    const {
        userData,
        setEdit
    } = useContext(userContextData);

    return (
        <div className="w-full lg:w-[25%] min-h-[300px] bg-white shadow-lg mt-[80px] p-3 relative">

            {/* Cover */}
            <div
                className="w-full h-[20vh] bg-[#838383] relative cursor-pointer"
                onClick={() => setEdit(true)}
            >

                <CiCamera
                    className="absolute right-[15px] top-[15px] w-[25px] h-[25px] cursor-pointer text-white z-10"
                />

                <img
                    src={userData?.user?.coverImage || null}
                    className="w-full h-[20vh] object-cover"
                    alt=""
                />

            </div>


            {/* Profile Image */}
            <div
                className="absolute rounded-full bg-[#ded8d8] w-[90px] h-[90px] top-[110px] left-[30px] border-4 border-white cursor-pointer"
                onClick={() => setEdit(true)}
            >

                <img
                    src={
                        userData?.user?.profileImage ||
                        profile
                    }
                    className="w-full h-full rounded-full object-cover"
                    alt="profile"
                />

            </div>


            {/* Plus Icon */}
            <GoPlusCircle
                className="absolute left-[100px] top-[150px] bg-[#438ac8] rounded-full text-white w-[22px] h-[22px]"
                onClick={() => setEdit(true)} />


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
    );
}

export default ProfileCard;
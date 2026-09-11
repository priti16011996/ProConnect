import React, { useContext, useState } from 'react';
import logo from '../assets/logo.png';
import { IoSearch } from "react-icons/io5";
import { IoHome } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { MdNotificationsActive } from "react-icons/md";
import profile from '../assets/profile.png'
import { userContextData } from '../context/UserContext';

function Nav() {
    const { userData } = useContext(userContextData);
    console.log(userData.user.firstName);

    return (
        <div className="w-full h-[60px] bg-white shadow-lg fixed top-0 flex justify-start items-center z-50">

            <div className="flex items-center gap-[10px]">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-[85px] h-[85px] object-contain"
                />


                <div className={`flex items-center bg-[#E5E4E2] rounded px-4}`}>
                    <IoSearch className="w-[25px] h-[25px] ml-2" />

                    <form>
                        <input
                            type="text"
                            placeholder="Search Here"
                            className="bg-transparent  w-[140px] lg:w-[300px] p-[7px] outline-none"
                        />
                    </form>
                </div>
            </div>
            <div className="flex ml-auto items-center gap-[20px]">
                <div className='w-[320px] h-[300px] bg-white absolute shadow-lg top-[63px]  '>
                    <div className='flex justify-center items-center'>
                        <img
                            src={profile}
                            alt="profile"
                            className="w-[55px] h-[55px] object-contain"
                        />
                    </div>
                    <div className='flex justify-center items-center'>
                        <span>{userData.user.firstName} {userData.user.lastName}</span>
                    </div>

                </div>
                <div className="lg:flex flex-col items-center hidden">
                    <IoHome />
                    <div>Home</div>
                </div>

                <div className="lg:flex flex-col items-center hidden">
                    <FaUserFriends />
                    <div>My Network</div>
                </div>

                <div className="flex flex-col items-center">
                    <MdNotificationsActive />
                    <div className='hidden md:block'>Notifications</div>
                </div>

                <img
                    src={profile}
                    alt="profile"
                    className="w-[55px] h-[55px] object-contain"
                />
            </div>

        </div >
    );
}

export default Nav;
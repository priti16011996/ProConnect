import React, { useContext, useState, useEffect } from "react";
import logo from '../assets/logo.png';
import { IoSearch } from "react-icons/io5";
import { IoHome } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { MdNotificationsActive } from "react-icons/md";
import profile from '../assets/profile.png'
import { userContextData } from '../context/UserContext';
import { AuthContextData } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Nav() {
    const { userData, setUserData } = useContext(userContextData);
    const [showPopup, setShowPopup] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    let { serverUrl } = useContext(AuthContextData);
    const navigate = useNavigate();

    useEffect(() => {
        const query = searchText.trim();

        if (!query) {
            setSearchResults([]);
            setShowResults(false);
            setSearchLoading(false);
            return;
        }

        let cancelled = false;

        const timer = setTimeout(async () => {
            try {
                setSearchLoading(true);

                const response = await axios.get(
                    `${serverUrl}/v1/api/user/search`,
                    {
                        params: { q: query },
                        withCredentials: true,
                    }
                );

                if (!cancelled) {
                    setSearchResults(response.data.users || []);
                    setShowResults(true);
                }
            } catch (error) {
                if (!cancelled) {
                    setSearchResults([]);
                    setShowResults(true);
                }

                console.error("Search users error:", error);
            } finally {
                if (!cancelled) {
                    setSearchLoading(false);
                }
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [searchText, serverUrl]);

    const handleLogout = async () => {
        try {
            let result = await axios.get(`${serverUrl}/v1/api/auth/logout`, { withCredentials: true });
            setUserData(null);
            console.log(result);

        } catch (error) {
            console.log(error);
        }
    }

    const handleProfilePopup = () => {
        setShowPopup(prev => !prev);
    };

    return (
        <div className="w-full h-[60px] bg-white shadow-lg fixed top-0 flex justify-start items-center z-50 left-0">

            <div className="flex items-center gap-[10px]">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-[85px] h-[85px] object-contain cursor-pointer"
                />


                <div className="relative">
                    <div className="flex items-center bg-[#E5E4E2] rounded-full px-3">
                        <IoSearch className="w-[22px] h-[22px] shrink-0" />

                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onFocus={() => {
                                if (searchText.trim()) setShowResults(true);
                            }}
                            placeholder="Search users..."
                            className="bg-transparent w-[140px] lg:w-[300px] p-[7px] outline-none"
                        />

                        {searchText && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchText("");
                                    setSearchResults([]);
                                    setShowResults(false);
                                }}
                                className="text-gray-500 px-1"
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {showResults && searchText.trim() && (
                        <div className="absolute left-0 top-full mt-2 w-[280px] lg:w-[350px] max-h-[350px] overflow-y-auto rounded-lg bg-white shadow-xl border border-gray-200 z-[60]">

                            {searchLoading ? (
                                <p className="p-4 text-sm text-gray-500">
                                    Searching users...
                                </p>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((person) => (
                                    <button
                                        key={person._id}
                                        type="button"
                                        onClick={() => {
                                            setShowResults(false);
                                            setSearchText("");
                                            navigate(`/profile/${person._id}`);
                                        }}
                                        className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-100"
                                    >
                                        <img
                                            src={person.profileImage || profile}
                                            alt=""
                                            className="w-11 h-11 rounded-full object-cover shrink-0"
                                        />

                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm truncate">
                                                {person.firstName} {person.lastName}
                                            </p>

                                            <p className="text-xs text-gray-500 truncate">
                                                {person.headline || person.userName || "User"}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <p className="p-4 text-sm text-gray-500">
                                    No users found.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex ml-auto items-center gap-[20px] ">
                {
                    showPopup &&
                    <div className='w-[320px] min-h-[300px] bg-white absolute shadow-lg top-[63px] p-[5px]'>
                        <div className='w-12 h-12 flex justify-center items-center cursor-pointer ml-[130px]'>
                            <img
                                src={userData?.user?.profileImage || profile}
                                alt="profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div className='flex justify-center items-center'>
                            <span>{userData.user.firstName} {userData.user.lastName}</span>
                        </div>
                        <div>
                            <button className='flex justify-center items-center w-[100%] h-[40px]  rounded-full border-[2px] mt-3 border-[#a4ccdd] text-[#a4ccdd]' onClick={() => { navigate("/profile") }}>View Profile</button>
                        </div>
                        <div className='w-full h-[1px] bg-gray-700 mt-3' ></div>
                        <div className="flex justify-start items-center gap-[10px] p-3 cursor-pointer" onClick={() => { navigate("/network") }}>
                            <FaUserFriends className='w-[25px] h-[25px]' />
                            <div>My Network</div>
                        </div>
                        <div>
                            <button className='flex justify-center items-center w-[100%] h-[40px]  rounded-full border-[2px]
                         mt-3 border-[#ec4545] text-[#ec4545] cursor-pointer' onClick={handleLogout}>Logout</button>
                        </div>

                    </div>
                }

                <div className="lg:flex flex-col items-center hidden cursor-pointer" onClick={() => { navigate("/") }}>
                    <IoHome />
                    <div>Home</div>
                </div>

                <div className="lg:flex flex-col items-center hidden cursor-pointer" onClick={() => { navigate("/network") }}>
                    <FaUserFriends />
                    <div>My Network</div>
                </div>

                <div className="flex flex-col items-center cursor-pointer">
                    <MdNotificationsActive />
                    <div className='hidden md:block'>Notifications</div>
                </div>
                <div className="w-12 h-12 flex flex-col items-center cursor-pointer mr-2" onClick={handleProfilePopup}>
                    <img
                        src={userData?.user?.profileImage || profile}
                        alt="profile"
                        className=" w-full h-full rounded-full object-cover"
                    />
                </div>
            </div>

        </div >
    );
}

export default Nav;
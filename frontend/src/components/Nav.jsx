
import React, {
    useContext,
    useState,
    useEffect,
    useRef,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import logo from "../assets/logo.png";
import profile from "../assets/profile.png";

import { IoSearch, IoHome } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { MdNotificationsActive } from "react-icons/md";

import { userContextData } from "../context/UserContext";
import { AuthContextData } from "../context/AuthContext";

function Nav() {
    const { userData, setUserData } = useContext(userContextData);
    const { serverUrl } = useContext(AuthContextData);
    const navigate = useNavigate();
    const location = useLocation();

    const [showPopup, setShowPopup] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const profilePopupRef = useRef(null);
    const profileButtonRef = useRef(null);
    const searchRef = useRef(null);

    const currentUser = userData?.user;

    const isActive = (path) => {
        if (path === "/profile") {
            return location.pathname === "/profile" ||
                location.pathname.startsWith("/profile/");
        }

        return location.pathname === path;
    };

    // Search users with debounce
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

    // Close popup and search when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                profilePopupRef.current &&
                !profilePopupRef.current.contains(event.target) &&
                profileButtonRef.current &&
                !profileButtonRef.current.contains(event.target)
            ) {
                setShowPopup(false);
            }

            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setShowResults(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowPopup(false);
                setShowResults(false);
            }
        };

        document.addEventListener("pointerdown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("pointerdown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const closePopupAndNavigate = (path) => {
        setShowPopup(false);
        setShowResults(false);
        navigate(path);
    };

    const handleLogout = async () => {
        try {
            await axios.get(
                `${serverUrl}/v1/api/auth/logout`,
                { withCredentials: true }
            );

            setUserData(null);
            setShowPopup(false);
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleSearchUser = (person) => {
        setSearchText("");
        setSearchResults([]);
        setShowResults(false);
        navigate(`/profile/${person._id}`);
    };

    return (
        <header className="fixed top-0 left-0 z-50 w-full h-16
            bg-white shadow-md border-b border-gray-100">

            <div className="relative mx-auto flex h-full w-full max-w-[1440px]
                items-center gap-2 px-2 sm:gap-4 sm:px-5 lg:px-8">

                {/* Logo */}
                <button
                    type="button"
                    onClick={() => closePopupAndNavigate("/")}
                    className="flex shrink-0 items-center justify-center"
                    aria-label="Go to home"
                >
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-10 w-10 object-contain sm:h-12 sm:w-12"
                    />
                </button>

                {/* Search */}
                <div
                    ref={searchRef}
                    className="relative min-w-0 flex-1 max-w-md"
                >
                    <div className="flex h-10 w-full items-center gap-2
                        rounded-full bg-gray-100 px-3
                        focus-within:ring-2 focus-within:ring-blue-200">

                        <IoSearch className="h-5 w-5 shrink-0 text-gray-600" />

                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onFocus={() => {
                                if (searchText.trim()) {
                                    setShowResults(true);
                                }
                            }}
                            placeholder="Search..."
                            aria-label="Search users"
                            className="w-full min-w-0 bg-transparent
                                text-sm outline-none placeholder:text-gray-500
                                sm:text-base"
                        />

                        {searchText && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchText("");
                                    setSearchResults([]);
                                    setShowResults(false);
                                }}
                                className="shrink-0 px-1 text-xl
                                    text-gray-500 hover:text-gray-900"
                                aria-label="Clear search"
                            >
                                &times;
                            </button>
                        )}
                    </div>

                    {/* Search dropdown */}
                    {showResults && searchText.trim() && (
                        <div className="absolute left-0 top-full mt-2
                            max-h-[min(350px,60vh)]
                            w-[min(350px,calc(100vw-1rem))]
                            overflow-y-auto rounded-xl border
                            border-gray-200 bg-white shadow-xl">

                            {searchLoading ? (
                                <p className="p-4 text-sm text-gray-500">
                                    Searching users...
                                </p>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((person) => (
                                    <button
                                        key={person._id}
                                        type="button"
                                        onClick={() => handleSearchUser(person)}
                                        className="flex w-full min-w-0 items-center
                                            gap-3 p-3 text-left
                                            hover:bg-gray-50"
                                    >
                                        <img
                                            src={person.profileImage || profile}
                                            alt=""
                                            className="h-10 w-10 shrink-0
                                                rounded-full object-cover"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm
                                                font-semibold text-gray-800">
                                                {person.firstName}{" "}
                                                {person.lastName}
                                            </p>

                                            <p className="truncate text-xs
                                                text-gray-500">
                                                {person.headline ||
                                                    person.userName ||
                                                    "User"}
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

                {/* Navigation links */}
                <nav className="ml-auto flex shrink-0 items-center
                    gap-3 sm:gap-5 md:gap-6"
                    aria-label="Main navigation">

                    <button
                        type="button"
                        onClick={() => closePopupAndNavigate("/")}
                        className={`flex flex-col items-center justify-center gap-0.5
        transition-colors
        ${isActive("/")
                                ? "text-blue-700 border-b-2 border-blue-700"
                                : "text-gray-600 hover:text-blue-700"
                            }`}
                        aria-label="Home"
                        aria-current={isActive("/") ? "page" : undefined}
                    >
                        <IoHome className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="hidden text-xs lg:block">Home</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => closePopupAndNavigate("/network")}
                        className={`flex flex-col items-center justify-center gap-0.5
    transition-colors
    ${isActive("/network")
                                ? "text-blue-700 border-b-2 border-blue-700"
                                : "text-gray-600 hover:text-blue-700"
                            }`}
                        aria-label="My Network"
                    >
                        <FaUserFriends className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="hidden text-xs lg:block">
                            Network
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            closePopupAndNavigate("/notification")
                        }
                        className={`flex flex-col items-center justify-center gap-0.5
    transition-colors
    ${isActive("/notification")
                                ? "text-blue-700 border-b-2 border-blue-700"
                                : "text-gray-600 hover:text-blue-700"
                            }`}
                        aria-label="Notifications"
                    >
                        <MdNotificationsActive
                            className="h-6 w-6 sm:h-7 sm:w-7"
                        />
                        <span className="hidden text-xs md:block">
                            Notifications
                        </span>
                    </button>

                    {/* Profile button */}
                    <button
                        ref={profileButtonRef}
                        type="button"
                        onClick={() => setShowPopup((prev) => !prev)}
                        className={`h-9 w-9 shrink-0 overflow-hidden rounded-full
    sm:h-10 sm:w-10
    ${isActive("/profile")
                                ? "ring-2 ring-blue-600 ring-offset-2"
                                : "border border-gray-200"
                            }`}
                        aria-label="Open profile menu"
                        aria-expanded={showPopup}
                    >
                        <img
                            src={currentUser?.profileImage || profile}
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                    </button>
                </nav>

                {/* Responsive profile popup */}
                {showPopup && (
                    <div
                        ref={profilePopupRef}
                        className="absolute right-2 top-[calc(100%+8px)]
                            z-[60] w-[min(320px,calc(100vw-1rem))]
                            rounded-xl border border-gray-200
                            bg-white p-4 shadow-xl sm:right-5"
                    >
                        <button
                            type="button"
                            onClick={() => setShowPopup(false)}
                            aria-label="Close profile menu"
                            className="absolute right-3 top-2
                                text-2xl leading-none text-gray-500
                                hover:text-gray-900"
                        >
                            &times;
                        </button>

                        <div className="flex flex-col items-center pt-3">
                            <img
                                src={currentUser?.profileImage || profile}
                                alt="Profile"
                                className="h-16 w-16 rounded-full
                                    object-cover"
                            />

                            <p className="mt-2 max-w-full break-words
                                text-center font-semibold text-gray-800">
                                {currentUser
                                    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""
                                        }`.trim()
                                    : "My Account"}
                            </p>

                            {currentUser?.headline && (
                                <p className="mt-1 text-center text-xs
                                    text-gray-500">
                                    {currentUser.headline}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                closePopupAndNavigate("/profile")
                            }
                            className="mt-4 h-10 w-full rounded-full
                                border border-blue-300 font-medium
                                text-blue-700 transition
                                hover:bg-blue-50"
                        >
                            View Profile
                        </button>

                        <div className="my-3 border-t border-gray-200" />

                        <button
                            type="button"
                            onClick={() =>
                                closePopupAndNavigate("/network")
                            }
                            className="flex min-h-11 w-full items-center
                                gap-3 rounded-lg px-2 text-left
                                text-gray-700 hover:bg-gray-100"
                        >
                            <FaUserFriends className="h-5 w-5 shrink-0" />
                            <span>My Network</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-2 h-10 w-full rounded-full
                                border border-red-300 font-medium
                                text-red-600 transition
                                hover:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Nav;

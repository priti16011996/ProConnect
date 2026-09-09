
import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
function Signup() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full min-h-screen bg-white flex flex-col items-center justify-start gap-[20px]">

            {/* Logo */}
            <div className="p-[5px] lg:p-[10px] w-full flex items-center">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-[100px] h-[100px]"
                />
            </div>

            {/* Signup Form */}
            <form className="w-[90%] max-w-[400px] md:shadow-xl flex flex-col items-center justify-center gap-[20px] p-[15px] rounded-[10px]">

                <h1 className="text-gray-800 text-[30px] font-semibold mb-[10px]">
                    Sign Up
                </h1>

                <input
                    type="text"
                    placeholder="First Name"
                    className="w-full h-[50px] rounded-md border border-gray-600 text-gray-800 px-[20px]"
                    required
                />

                <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full h-[50px] rounded-md border border-gray-600 text-gray-800 px-[20px]"
                    required
                />

                <input
                    type="text"
                    placeholder="Username"
                    className="w-full h-[50px] rounded-md border border-gray-600 text-gray-800 px-[20px]"
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full h-[50px] rounded-md border border-gray-600 text-gray-800 px-[20px]"
                    required
                />

                {/* Password */}
                <div className="w-full relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full h-[50px] rounded-md border border-gray-600 text-gray-800 px-[20px] pr-[80px]"
                        required
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-[15px] top-1/2 -translate-y-1/2 text-blue-500 font-medium"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                <button
                    type="submit"
                    className=" cursor-pointer w-full h-[50px] rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
                >
                    Sign Up
                </button>
                <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-500 font-medium hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;

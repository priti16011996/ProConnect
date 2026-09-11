
import React, { useState, useContext } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContextData } from "../context/AuthContext.jsx";
import axios from "axios";
import { userContextData } from "../context/UserContext.jsx";
function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    let navigate = useNavigate();
    let { serverUrl } = useContext(AuthContextData);
    let { userData, setUserData } = useContext(userContextData);
    let [firstName, setFirstName] = useState("");
    let [lastName, setLastName] = useState("");
    let [userName, setUserName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState("");
    let handleSignup = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            console.log(firstName, lastName, userName, email, password);
            let result = await axios.post(`${serverUrl}/v1/api/auth/signup`, {
                firstName,
                lastName,
                userName,
                email,
                password,
            }, { withCredentials: true });
            setUserData(result.data);
            navigate("/");
            setError("");
            setFirstName("");
            setLastName("");
            setUserName("");
            setEmail("");
            setPassword("");
            setLoading(false);
            console.log(result);
        }
        catch (err) {
            console.log(err);
            setError(err.response.data.message);
            setLoading(false);
        }
    }
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
            <form className="w-[90%] max-w-[400px] md:shadow-xl flex flex-col items-center justify-center gap-[20px] p-[15px] rounded-[10px]" onSubmit={handleSignup}>

                <h1 className="text-gray-800 text-[30px] font-semibold mb-[10px]">
                    Sign Up
                </h1>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="text"
                    placeholder="First Name"
                    className="w-full h-[50px] rounded-md border border-gray-600 text-gray-800 px-[20px]"
                    required onChange={(e) => setFirstName(e.target.value)} value={firstName}
                />

                <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full h-[50px] rounded-md border border-gray-600 text-gray-800 px-[20px]"
                    required onChange={(e) => setLastName(e.target.value)} value={lastName}
                />

                <input
                    type="text"
                    placeholder="Username"
                    className="w-full h-[50px] rounded-md border border-gray-600 text-gray-800 px-[20px]"
                    required onChange={(e) => setUserName(e.target.value)} value={userName}
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full h-[50px] rounded-md border border-gray-600 text-gray-800 px-[20px]"
                    required onChange={(e) => setEmail(e.target.value)} value={email}
                />

                {/* Password */}
                <div className="w-full relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full h-[50px] rounded-md border border-gray-600 text-gray-800 px-[20px] pr-[80px]"
                        required onChange={(e) => setPassword(e.target.value)} value={password}
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
                    disabled={loading}
                >
                    {loading ? "Signing Up..." : "Sign Up "}
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

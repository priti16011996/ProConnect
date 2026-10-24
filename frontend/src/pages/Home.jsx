import React, { useContext } from "react";
import Nav from "../components/Nav";
import EditProfile from "../components/EditProfile";
import CreatePost from "../components/CreatePost";
import PostFeed from "../components/PostFeed";
import { userContextData } from "../context/UserContext";
import ProfileCard from "../components/ProfileCard";
import SuggestedUsers from "../components/SuggestedUsers";



function Home() {

    const {
        userData,
        edit,
        setEdit
    } = useContext(userContextData);

    return (
        <div className="relative w-full min-h-screen bg-[#E5E4E2] flex justify-center items-start gap-[20px] px-[20px] flex-col lg:flex-row">

            {edit && <EditProfile />}

            <Nav />
            <ProfileCard />


            {/* MIDDLE */}
            <div className="w-full lg:w-[50%] min-h-[200px] lg:mt-[80px]">

                <CreatePost />

                <PostFeed />

            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-[25%] min-h-[300px] bg-white shadow-lg lg:mt-[80px]">
                <SuggestedUsers />
            </div>

        </div>
    );
}

export default Home;
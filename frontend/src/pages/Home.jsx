import React, { useContext } from 'react'
import Nav from '../components/Nav'
import { GoPlusCircle } from "react-icons/go";
import { userContextData } from '../context/UserContext';
import { CiCamera } from "react-icons/ci";
function Home() {
    const { userData, setUserData } = useContext(userContextData);
    return (
        <div className='w-fullmin-h-[100vh] bg-[#E5E4E2] flex justify-center items-start gap-[20px] px-[20px] flex-col lg:flex-row'>
            <Nav />
            <div className='w-full lg:w-[25%] min-h-[300px]  flex-col lg:flex-row  bg-[white] shadow-lg mt-[80px]'>
                <div className='w-full h-[20vh] bg-[#838383]'>
                    <CiCamera className='relative left-[678px] top-[15px] w-[20px] h-[20px] ' />
                </div>
                <div className='absolute rounded-full bg-[#ded8d8] w-[90px] h-[90px] top-[25vh] ml-6'></div>
                <GoPlusCircle className='absolute left-[118px] bg-[#438ac8] rounded-full text-[white] w-[20px] h-[20px]' />
                <div className='flex justify-start items-start relative top-[45px] left-[27px]'>
                    <span>{userData.user.firstName} {userData.user.lastName}</span>
                </div>
                <div className='flex justify-start items-start relative top-[45px] left-[27px]'>
                    <span>{userData.user.location}</span>
                </div>
                <div className='mt-[60px]'>
                    <button className='flex justify-center items-center w-[100%] h-[40px]  rounded-full border-[2px] mt-3 border-[#a4ccdd] text-[#a4ccdd]'>View Profile</button>
                </div>
            </div>
            <div className='w-full lg:w-[50%] min-h-[300px]  flex-col lg:flex-row  bg-[white] shadow-lg lg:mt-[80px]'></div>
            <div className='w-full lg:w-[25%] min-h-[300px]  flex-col lg:flex-row  bg-[white] shadow-lg lg:mt-[80px]'></div>
        </div>
    )
}

export default Home

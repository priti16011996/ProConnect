import React, { useContext, useRef, useState } from "react";
import { userContextData } from "../context/UserContext";
import { CiCamera } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { GoPlusCircle } from "react-icons/go";
import profile from '../assets/profile.png'

function EditProfile() {

    const {
        userData,
        setUserData,
        setEdit
    } = useContext(userContextData);

    const [formData, setFormData] = useState({
        firstName: userData?.user?.firstName || "",
        lastName: userData?.user?.lastName || "",
        email: userData?.user?.email || "",
        userName: userData?.user?.userName || "",
        location: userData?.user?.location || "",
        gender: userData?.user?.gender || "",
    });

    // New skill input
    const [newSkills, setNewSkills] = useState("");

    // Existing skills from database
    const [skills, setSkills] = useState(
        userData?.user?.skills || []
    );

    const [education, setEducation] = useState(userData?.user?.education || []);
    const [newEducation, setNewEducation] = useState({
        college: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
    })
    const [experience, setExperience] = useState(
        userData?.user?.experience || []
    );

    const [newExperience, setNewExperience] = useState({
        title: "",
        company: "",
        description: ""
    });
    const [frontendProfilePic, setFrontendProfilePic] = useState(userData?.user?.profileImage || profile);
    const [backendProfilePic, setBackendProfilePic] = useState(null);
    const [frontendCoverPic, setFrontendCoverPic] = useState(userData?.user?.coverImage);
    const [backendCoverPic, setBackendCoverPic] = useState(null);
    let userProfileRef = useRef();
    let useCoverImgRef = useRef();
    const handleAddExperience = () => {
        if (
            !newExperience.title.trim() ||
            !newExperience.company.trim() ||
            !newExperience.description.trim()
        ) {
            return;
        }

        setExperience((prev) => [
            ...prev,
            newExperience
        ]);

        setNewExperience({
            title: "",
            company: "",
            description: ""
        });
    };

    const handleRemoveExperience = (index) => {
        setExperience((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // Add skill
    const handleAddSkill = () => {

        if (!newSkills.trim()) return;

        // Prevent duplicate skill
        if (
            skills.some(
                (skill) =>
                    skill.toLowerCase() ===
                    newSkills.trim().toLowerCase()
            )
        ) {
            setNewSkills("");
            return;
        }

        setSkills((prev) => [
            ...prev,
            newSkills.trim()
        ]);

        setNewSkills("");
    };


    // Remove skill
    const handleRemoveSkill = (index) => {

        setSkills((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        setUserData((prev) => ({
            ...prev,

            user: {
                ...prev.user,
                ...formData,
                skills: skills,
                education: education,
                experience: experience
            }
        }));

        setEdit(false);
    };

    const handleAddEducation = () => {

        if (
            !newEducation.college.trim() ||
            !newEducation.degree.trim() ||
            !newEducation.fieldOfStudy.trim() ||
            !newEducation.startYear ||
            !newEducation.endYear
        ) {
            return;
        }

        setEducation((prev) => [
            ...prev,
            newEducation
        ]);
        console.log(newEducation)
        setNewEducation({
            college: "",
            degree: "",
            fieldOfStudy: "",
            startYear: "",
            endYear: ""
        });
    };
    const handleRemoveEducation = (index) => {

        setEducation((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleProfileImage = (event) => {
        let file = event.target.files[0];
        if (!file) return;
        setFrontendProfilePic(URL.createObjectURL(file));
        setBackendProfilePic(file);
    }

    const handleCoverImage = (event) => {
        let file = event.target.files[0];
        if (!file) return;
        setFrontendCoverPic(URL.createObjectURL(file));
        setBackendCoverPic(file);
    }

    return (
        <div className="fixed inset-0 z-[1000] flex justify-center items-center">

            {/* Overlay */}
            <div
                onClick={() => setEdit(false)}
                className="absolute inset-0 bg-black/50"
            ></div>


            {/* Popup */}
            <div className="relative z-[1001] w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">


                {/* Header */}
                <div className="flex justify-between items-center px-5 py-4 border-b">

                    <h2 className="text-xl font-semibold">
                        Edit Profile
                    </h2>

                    <button
                        type="button"
                        onClick={() => setEdit(false)}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <RxCross2 size={22} />
                    </button>

                </div>


                {/* Cover */}
                <div
                    className="relative w-full h-[120px] bg-gray-300 cursor-pointer"
                    onClick={() => useCoverImgRef.current.click()}
                >
                    {frontendCoverPic && <img
                        src={frontendCoverPic}
                        alt=""
                        className="w-full h-full object-cover"
                    />}

                    <CiCamera
                        className="absolute right-4 top-4 text-white z-10"
                        size={25}
                    />
                </div>


                {/* Profile Image */}
                <div
                    className="relative flex justify-center cursor-pointer"
                    onClick={() => userProfileRef.current.click()}
                >
                    <div className="absolute top-[-35px] w-[90px] h-[90px] rounded-full bg-gray-200 border-4 border-white overflow-hidden">
                        <img
                            src={frontendProfilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Plus Icon */}
                    <GoPlusCircle
                        className="absolute left-[274px] bg-[#438ac8] rounded-full text-white w-[22px] h-[22px] cursor-pointer"
                    />
                </div>


                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="px-6 pt-[65px] pb-6"
                >
                    <input type="file" accept="image/*" ref={userProfileRef} hidden onChange={handleProfileImage} />
                    <input type="file" accept="image/*" ref={useCoverImgRef} hidden onChange={handleCoverImage} />

                    {/* First Name */}
                    <div className="mb-4">

                        <label className="block text-sm font-medium mb-1">
                            First Name
                        </label>

                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                        />

                    </div>


                    {/* Last Name */}
                    <div className="mb-4">

                        <label className="block text-sm font-medium mb-1">
                            Last Name
                        </label>

                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                        />

                    </div>
                    {/* Gender */}
                    <div className="mb-4">

                        <label className="block text-sm font-medium mb-1">
                            Gender
                        </label>

                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                    </div>
                    {/* Email */}
                    <div className="mb-4">

                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>

                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                        />

                    </div>
                    {/* Username */}
                    <div className="mb-4">

                        <label className="block text-sm font-medium mb-1">
                            Username
                        </label>

                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                        />

                    </div>
                    {/* Location */}
                    <div className="mb-4">

                        <label className="block text-sm font-medium mb-1">
                            Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                        />

                    </div>


                    {/* ================= SKILLS ================= */}

                    <div className="mb-4 border border-gray-300 rounded-md p-4">

                        <label className="block text-sm font-medium mb-3">
                            Skills
                        </label>


                        {/* Skills List */}

                        <div className="flex flex-wrap gap-2 mb-4">

                            {skills.map((skill, index) => (

                                <div
                                    key={index}
                                    className="flex items-center gap-2 bg-[#e8f4fb] text-[#438ac8] px-3 py-1 rounded-full"
                                >

                                    <span>
                                        {skill}
                                    </span>


                                    {/* Remove */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveSkill(index)
                                        }
                                        className="text-gray-500 hover:text-red-500 font-bold"
                                    >
                                        ×
                                    </button>

                                </div>

                            ))}

                        </div>


                        {/* Add Skill */}

                        <div className="flex items-center gap-3">

                            <input
                                type="text"
                                value={newSkills}
                                onChange={(e) =>
                                    setNewSkills(e.target.value)
                                }
                                onKeyDown={(e) => {

                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddSkill();
                                    }

                                }}
                                placeholder="Add new skill"
                                className="flex-1 border-b border-gray-300 py-2 outline-none focus:border-[#438ac8]"
                            />


                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="font-semibold text-[#438ac8]"
                            >
                                Add
                            </button>

                        </div>

                    </div>
                    {/* ================= EDUCATION ================= */}

                    <div className="mb-4 border border-gray-300 rounded-md p-4">

                        <label className="block text-sm font-medium mb-4">
                            Education
                        </label>


                        {/* Existing Education */}

                        <div className="flex flex-col gap-3 mb-5">

                            {education.map((edu, index) => (

                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                                >

                                    <div className="flex justify-between items-start">

                                        <div>

                                            <h3 className="font-semibold text-gray-800">
                                                {edu.degree}
                                            </h3>

                                            <p className="text-sm text-gray-600">
                                                {edu.fieldOfStudy}
                                            </p>

                                            <p className="text-sm text-gray-600">
                                                {edu.college}
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                                {edu.startYear} - {edu.endYear}
                                            </p>

                                        </div>


                                        {/* Remove */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveEducation(index)
                                            }
                                            className="text-red-500 font-bold text-lg"
                                        >
                                            ×
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>


                        {/* Add Education Form */}

                        <div className="flex flex-col gap-3">

                            {/* College */}

                            <input
                                type="text"
                                placeholder="College / University"
                                value={newEducation.college}
                                onChange={(e) =>
                                    setNewEducation((prev) => ({
                                        ...prev,
                                        college: e.target.value
                                    }))
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                            />


                            {/* Degree */}

                            <input
                                type="text"
                                placeholder="Degree"
                                value={newEducation.degree}
                                onChange={(e) =>
                                    setNewEducation((prev) => ({
                                        ...prev,
                                        degree: e.target.value
                                    }))
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                            />


                            {/* Field of Study */}

                            <input
                                type="text"
                                placeholder="Field of Study"
                                value={newEducation.fieldOfStudy}
                                onChange={(e) =>
                                    setNewEducation((prev) => ({
                                        ...prev,
                                        fieldOfStudy: e.target.value
                                    }))
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                            />


                            {/* Years */}

                            <div className="flex gap-3">

                                {/* Start Date */}
                                <div className="w-1/2">

                                    <label className="block text-sm font-medium mb-1">
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        value={newEducation.startYear}
                                        onChange={(e) =>
                                            setNewEducation((prev) => ({
                                                ...prev,
                                                startYear: e.target.value
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                                    />

                                </div>


                                {/* End Date */}
                                <div className="w-1/2">

                                    <label className="block text-sm font-medium mb-1">
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        value={newEducation.endYear}
                                        onChange={(e) =>
                                            setNewEducation((prev) => ({
                                                ...prev,
                                                endYear: e.target.value
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                                    />

                                </div>

                            </div>


                            {/* Add Button */}

                            <button
                                type="button"
                                onClick={handleAddEducation}
                                className="self-start px-5 py-2 mt-2 border-2 border-[#438ac8] text-[#438ac8] rounded-full font-semibold hover:bg-[#e8f4fb]"
                            >
                                + Add Education
                            </button>

                        </div>

                    </div>
                    {/* Experience Section */}
                    <div className="mb-4 border border-gray-300 rounded-md p-4">

                        <label className="block text-sm font-medium mb-4">
                            Experience
                        </label>

                        {/* Existing Experience */}
                        <div className="flex flex-col gap-3 mb-5">

                            {experience.map((exp, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                                >
                                    <div className="flex justify-between items-start">

                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {exp.title}
                                            </h3>

                                            <p className="text-sm text-gray-600">
                                                {exp.company}
                                            </p>

                                            <p className="text-sm text-gray-500 mt-2">
                                                {exp.description}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExperience(index)}
                                            className="text-red-500 font-bold text-lg"
                                        >
                                            ×
                                        </button>

                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Add New Experience */}
                        <div className="flex flex-col gap-3">

                            <input
                                type="text"
                                placeholder="Job Title"
                                value={newExperience.title}
                                onChange={(e) =>
                                    setNewExperience((prev) => ({
                                        ...prev,
                                        title: e.target.value
                                    }))
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                            />

                            <input
                                type="text"
                                placeholder="Company Name"
                                value={newExperience.company}
                                onChange={(e) =>
                                    setNewExperience((prev) => ({
                                        ...prev,
                                        company: e.target.value
                                    }))
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                            />

                            <textarea
                                placeholder="Describe your role and responsibilities"
                                value={newExperience.description}
                                onChange={(e) =>
                                    setNewExperience((prev) => ({
                                        ...prev,
                                        description: e.target.value
                                    }))
                                }
                                rows={4}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none resize-none focus:border-blue-500"
                            />

                            <button
                                type="button"
                                onClick={handleAddExperience}
                                className="self-start px-5 py-2 mt-2 border-2 border-[#438ac8] text-[#438ac8] rounded-full font-semibold hover:bg-[#e8f4fb]"
                            >
                                + Add Experience
                            </button>

                        </div>

                    </div>
                    {/* Buttons */}

                    <div className="flex justify-end gap-3 mt-6">

                        <button
                            type="button"
                            onClick={() => setEdit(false)}
                            className="px-5 py-2 border rounded-full"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#438ac8] text-white rounded-full"
                        >
                            Save
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditProfile;
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";

export default function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const [userDetails,setUserDetails] = useState("")
  const [loading,setLoading] = useState(true)

  async function fetchuserDetails(){
    const response = await fetch(`http://127.0.0.1:8000/api/blog/${user.id}`)

    const data = await response.json()

    // console.log(data)

    if(!response.ok || data.status === "Fail")
        alert("Something went wrong")
    else if(data.status === "Success")
    {
        // alert("Details fetched successfully")
        setUserDetails(data.data)
        setLoading(false)
    }
  }
  useEffect(()=>{
    fetchuserDetails()
  },[])

  const [imagePreview, setImagePreview] = useState(
    userDetails?.photo || null
  );

  // 🔹 Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
        {loading && <LoadingOverlay/>}
        {!loading && <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10">

            {/* Header */}
            <div className="relative flex items-center justify-center mb-10">

            <button
                onClick={() => navigate("/")}
                className="absolute left-0 text-gray-600 hover:text-black transition"
            >
                ← Back
            </button>

            <h1 className="text-3xl font-bold text-gray-800">
                My Profile
            </h1>

            </div>

            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
            <div className="relative">

                <img
                src={
                    imagePreview ||
                    "https://ui-avatars.com/api/?name=" + userDetails?.name
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />

                <label className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-blue-700 transition">
                Change
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
                </label>
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                {userDetails?.name}
            </h2>

            <p className="text-gray-500">
                {userDetails?.email}
            </p>
            </div>

            {/* User Info Section */}
            <div className="space-y-6">

            <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-medium text-gray-800">{userDetails?._id}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium text-gray-800">
                {new Date(userDetails?.createdAt).toDateString()}
                </p>
            </div>

            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex gap-4">

            <button
                onClick={() => navigate("/edit-profile")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-medium"
            >
                Edit Profile
            </button>

            <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition font-medium"
            >
                Logout
            </button>

            </div>

        </div>}
    </div>
  );
}
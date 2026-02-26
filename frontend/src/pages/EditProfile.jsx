import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [loading,setLoading] = useState(false)
  
  // async function fetchuserDetails(){
  //   const response = await fetch(`http://127.0.0.1:8000/api/blog/${storedUser.id}`)

  //   const data = await response.json()

  //   // console.log(data)
  //   if(!response.ok || data.status === "Fail")
  //     alert("Something went wrong")
  //   else if(data.status === "Success")
  //     {
  //       // alert("Details fetched successfully")
  //       setUserDetails(data.data)
  //       setLoading(false)
  //     }
  //   }
  // useEffect(()=>{
  //   fetchuserDetails()
  // },[])
    
  const [imagePreview, setImagePreview] = useState(
  storedUser?.photo || null
);
  const [formData, setFormData] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    password: "",
  });


  // 🔹 Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Save changes
  async function handleSubmit () {
    setLoading(true);

    const updatedUser = {
      ...storedUser,
      name: formData.name,
      email: formData.email,
      photo: imagePreview,
    };

    const res = await fetch(`http://127.0.0.1:8000/api/v1/users/${storedUser.id}`, {  
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        user:storedUser,
        name: updatedUser.name,
        email: updatedUser.email
      })
    })

    const data = await res.json()

    // console.log(data)

    if (res.ok) {
      // ✅ update localStorage with new details
      localStorage.setItem("user", JSON.stringify({
        id: data.user._id,
        name: data.user.name,
        email: data.user.email
      }))
    }

    if(data.status === "Fail" && data.message.includes("E11000 duplicate key error collection"))
    {
      alert("User with this mail already exists")
      setLoading(false);
      return
    }
    
    setTimeout(() => {
      setLoading(false);
      navigate("/profile");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10">

        {/* Header */}
        <div className="relative flex items-center justify-center mb-10 h-10">

          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 text-gray-600 hover:text-black transition"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-gray-800">
            Edit Profile
          </h1>

        </div>

        <form className="space-y-8">

          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">

              <img
                src={
                  imagePreview ||
                  "https://ui-avatars.com/api/?name=" + storedUser.name
                }
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
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
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={(e)=>setFormData({...formData,name:e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={(e)=>setFormData({...formData,email:e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password (Optional) */}
          {/* <div>
            <label className="block text-gray-700 font-medium mb-2">
              New Password (optional)
            </label>
            <input
              type="password"
              name="password"
              value={storedUser.password}
              onChange={handleChange}
              placeholder="Leave blank if unchanged"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition font-medium"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={()=>handleSubmit()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-medium"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, UserCircle } from "lucide-react"
import { blogs } from "../assets/blogs";

export default function Home(){

    const [search, setSearch] = useState("");
    const [pagination,setPagination] = useState(1);
    const navigate = useNavigate()
    const [isLoggenIn,setIsLoggedIn] = useState(localStorage.getItem("token")?true:false)

    let maxPagination = 5;
    const numbers = Array.from({ length: maxPagination }, (_, i) => i + 1);


    return(
        <div className="min-h-screen bg-gray-50">

      {/* 🔥 Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Blogify</h1>

          {isLoggenIn?<div className="flex gap-10">
            <Link>My Blogs</Link>
            <Link>Create Blog</Link>
            <UserCircle/>
            <LogOut onClick={() => {
              localStorage.removeItem("token")
              setIsLoggedIn(false)
            }}/>
          </div>
          :<div className="space-x-4">
            <button onClick={() => navigate("/login")} className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800 transition">
              Login
            </button>
            <button onClick={() => navigate("/signup")} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow">
              Register
            </button>
          </div>}
        </div>
      </nav>

      {/* 🧠 Hero Section */}
      <section className="text-center py-16 px-6">
        <h2 className="text-4xl font-bold mb-4">
          Discover & Share Amazing Blogs
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore articles from developers around the world. Search, read,
          and grow your knowledge.
        </p>
      </section>

      {/* 🔍 Search Bar */}
      <div className="max-w-4xl mx-auto px-6 mb-10">
        <div className="flex items-center bg-white shadow-md rounded-2xl overflow-hidden">
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-6 py-4 outline-none"
          />
          <button className="bg-blue-600 text-white px-6 py-4 hover:bg-blue-700 transition">
            Search
          </button>
        </div>
      </div>

      {/* 📰 Blog Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  By {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <button className="mt-3 text-blue-600 font-medium hover:text-blue-800">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-center pb-16">
        <div className="flex space-x-3">
          <button onClick={()=>setPagination(prev=>prev===1?maxPagination:prev-1)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition cursor-pointer">
            Prev
          </button>
          {numbers.map(num =>
          <button onClick={()=>setPagination(num)} className={`px-4 py-2 ${num === pagination?"bg-blue-600 text-white":"bg-gray-200 text-neutral-800"} rounded-lg shadow`}>
            {num}
          </button>)}
          <button onClick={()=>setPagination(prev=>prev===maxPagination?1:prev+1)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition cursor-pointer">
            Next
          </button>
        </div>
      </div>
    </div>
    )
}
import { useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Signup() {
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmpassword,setConfirmpassword] = useState("")

  async function handleSignup(){
    if((!name||!email||!password) || (password !== confirmpassword))
    {
      alert("Please enter all details correctly")
      return
    }
    // console.log(name,email,password)
    try{
    const response = await fetch(`${API}/api/blog/register`,{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if(!response.ok)
    {
      alert(data.message);
      return;
    }

    alert(data.message)
  }
  catch(err)
  {
    alert(err)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-200">

        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Create Account ✨
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Join us and get started today
        </p>

        <form className="mt-6 space-y-5">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Enter the same password here to confirm"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-medium hover:bg-blue-700 transition shadow-md"
            onClick={()=>handleSignup()}
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

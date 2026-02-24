import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email,setEmail] = useState(null)
  const [password,setPassword] = useState(null)
  const navigate = useNavigate()

  async function handlelogin(){
    if(!email || !password)
    {
      alert("Please enter all details");
      return;
    }

    try{
      const response = await fetch("http://127.0.0.1:8000/api/blog/login",{
        method:"POST",
         headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
      }),
    });

    const data = await response.json();

    if(data.status === "Success")
    {
      localStorage.setItem("token","token123")
      navigate("/")

    }
    alert(data.message)

    }
    catch(err){
      alert(err.message)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-200">

        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Welcome Back 👋
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Login to continue to your account
        </p>

        <form className="mt-6 space-y-5">
          
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
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="button"
            className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-medium hover:bg-blue-700 transition shadow-md"
            onClick={()=>handlelogin()}
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}

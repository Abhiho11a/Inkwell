import { Route, Routes } from "react-router-dom";
import "./App.css"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyBlog from "./pages/MyBlog";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Analytics from "./pages/Analytics";

export default function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/myblog" element={<MyBlog/>}/>
      <Route path="/create-blog" element={<CreateBlog/>}/>
      <Route path="/edit-blog/:id" element={<EditBlog/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/edit-profile" element={<EditProfile/>}/>
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
    </>
  );
}

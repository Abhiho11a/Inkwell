import { Route, Routes } from "react-router-dom";
import "./App.css"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyBlog from "./pages/MyBlog";
import CreateBlog from "./pages/CreateBlog";

export default function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/myblog" element={<MyBlog/>}/>
      <Route path="create-blog" element={<CreateBlog/>}/>
    </Routes>
    </>
  );
}

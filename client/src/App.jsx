import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./components/SinglePost";
import UpdatePost from "./pages/UpdatePost";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreatePost/>} />
        <Route path="/post/:id" element={<SinglePost/>} />
        <Route path="/edit/:id" element={<UpdatePost/>} />
      </Route>
    </Routes>
  );
}

export default App;

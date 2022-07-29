import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import AddCamera from "./components/AddCamera";

function App() {
  const user = localStorage.getItem("token")
  return (
    <Routes>
      {user && <Route path="/" exact element={<Main />} />}
      {user && <Route path="/addcamera" exact element={<AddCamera />} />}
      <Route path="/register" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/" exact element={<Navigate replace to="/login" />} />
      <Route path="/addcamera" exact element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;

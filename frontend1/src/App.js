import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import AddCamera from "./components/AddCamera";
import ShowCam from "./components/ShowCam";

function App() {
  const user = localStorage.getItem("token");
  const [ipcam, setIpcam] = useState("hello");
  const [camname, setCamname] = useState("cam name");

  return (
    <Routes>
      {user && (<Route path="/" exact element={<Main camname={camname} setCamname={setCamname} />}/>)}
      {user && <Route path="/addcamera" exact element={<AddCamera />} />}
      {user && <Route path="/showVideo" exact element={<ShowCam ipcam={ipcam} setIpcam={setIpcam} camname={camname} />} />}
      <Route path="/register" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/" exact element={<Navigate replace to="/login" />} />
      <Route path="/addcamera" exact element={<Navigate replace to="/login" />} />
      <Route path="/showVideo" exact element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;

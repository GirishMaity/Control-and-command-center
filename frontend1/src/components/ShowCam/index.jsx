import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

const ShowCam = ({ camname, ipcam, setIpcam }) => {
  const videoRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {}, [ipcam]);

  const camDisplay = async () => {
    let token = Cookies.get("token");
    const url = "http://localhost:5000/showcamera";

    const { data: res } = await axios.post(
      url,
      { cameraname: camname },
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    setIpcam(res.ip);
  };

  camDisplay();

  return (
    <>
      <iframe width="700vh" height="500vh" src={ipcam} frameborder="0"></iframe>
      <button onClick={() => navigate("/")}>Go Back</button>
    </>
  );
};

export default ShowCam;

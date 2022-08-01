import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
//import { Navigate } from "react-router";

const ShowCam = ({ camname, ipcam, setIpcam }) => {
  const videoRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(`ye camname hai ${camname}`);
    //videoRef.current?.load();
  }, [ipcam]);

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
    console.log(`res.ip hai yeh ${res.ip}`);
    console.log(`ipcam hai yeh ${ipcam}`);

    //navigate("/showVideo", { replace: true });
  };

  camDisplay();

  return (
    <>
      <iframe width="700vh" height="500vh" src={ipcam} frameborder="0"></iframe>
      <button onClick={() => navigate("/")}>Go Back</button>
      {/* <button onClick={camDisplay}>click</button> */}
    </>
  );
};

export default ShowCam;

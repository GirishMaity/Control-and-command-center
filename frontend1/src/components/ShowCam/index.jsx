import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {Link} from "react-router-dom";
import styles from "./styles.module.css";
//import { Navigate } from "react-router";

const ShowCam = ({ camname, ipcam, setIpcam }) => {
  const videoRef = useRef();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const res = await axios.get("http://localhost:5000/logout");
    if (res.status === 200) {
      localStorage.clear();
      Cookies.remove("token", { path: "/", domain: "localhost" });
      window.location.reload();
      navigate("/login", { replace: true });
    } else {
      throw new Error("Could not logout the user.");
    }
  };

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
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <Link to="/">
          <button type="button" className={styles.white_btnn}>
            Go Back
          </button>
        </Link>
        <h1>View A Camera</h1>
        <button className={styles.white_btnn} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className={styles.addcamera_container}>
        <div className={styles.addcamera_form_container}>
          <div className={styles.right}>
          <center><iframe width="700vh" height="500vh" src={ipcam} frameborder="0"></iframe></center>
          <h2>{camname}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCam;

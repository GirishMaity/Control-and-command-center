import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Main = () => {
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
  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <Link to="/addcamera">
          <button type="button" className={styles.white_btn}>
            Add New Camera
          </button>
        </Link>
        <h1>WELCOME TO LIVE CAMERAS STREAMING</h1>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Main;

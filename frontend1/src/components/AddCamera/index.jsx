import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";

const AddCamera = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const [data, setData] = useState({
    ipaddress: "",
    cameraname: "",
    city: "",
    state: "",
    country: "",
    maplink: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5000/addcamera";
      const { data: res } = await axios.post(url, data);
      navigate("/");
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <Link to="/">
          <button type="button" className={styles.white_btnn}>
            Go Back
          </button>
        </Link>
        <h1>Add A New Camera</h1>
        <button className={styles.white_btnn} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className={styles.addcamera_container}>
        <div className={styles.addcamera_form_container}>
          <div className={styles.right}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <div className={styles.marquee}>
                <h3>Please Fill All The Details Carefully </h3>
              </div>
              <input
                type="text"
                placeholder="Camera Name"
                name="cameraname"
                onChange={handleChange}
                value={data.cameraname}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Camera Ip Address"
                name="ipaddress"
                onChange={handleChange}
                value={data.ipaddress}
                required
                className={styles.input}
              />
              <h3>Carefully Add Location Of Camera </h3>
              <input
                type="text"
                placeholder="City Of Camera Located"
                name="city"
                onChange={handleChange}
                value={data.city}
                //required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="State Of Camera Located"
                name="state"
                onChange={handleChange}
                value={data.state}
                //required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Country Of Camera Located"
                name="country"
                onChange={handleChange}
                value={data.country}
                //required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Google Map Link Of Camera Located"
                name="maplink"
                onChange={handleChange}
                value={data.maplink}
                //required
                className={styles.input}
              />
              {error && <div className={styles.error_msg}>{error}</div>}
              <button type="submit" className={styles.green_btn}>
                Add Camera
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCamera;

import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import Cookies from "js-cookie";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setUser({ ...user, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5000/login";
      await axios.post(url, user).then((data) => {
        const { token } = data.data;
        localStorage.setItem("token", token);
        Cookies.set("token", token);
      });
      //localStorage.setItem("token", res.user);
      window.location = "/";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <h1>New Here ?</h1>
          <Link to="/register">
            <button type="button" className={styles.white_btn}>
              Sign Up
            </button>
          </Link>
        </div>

        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1> Login To Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={user.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={user.password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

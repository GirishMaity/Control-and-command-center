import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import React  from 'react';

const Main = () => {

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }
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
    )
};

export default Main;
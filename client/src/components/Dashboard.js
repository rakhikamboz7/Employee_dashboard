import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    axios
      .get("http://localhost:5002/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserName(res.data.name))
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Admin Panel</h1>
        <nav>
          <button onClick={() => navigate("/create-employee")}>Create Employee</button>
          <button onClick={() => navigate("/employee-list")}>Employee List</button>
          <span>{userName}</span>
          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
      <main>
        <h2>Welcome to the Admin Panel!</h2>
      </main>
    </div>
  );
};

export default Dashboard;

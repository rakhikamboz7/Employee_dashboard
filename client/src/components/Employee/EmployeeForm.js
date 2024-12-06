import React, { useState } from "react";
import axios from "axios";
import styles from "./EmployeeForm.module.css";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    f_Name: "",
    f_Email: "",
    f_Mobile: "",
    f_Designation: "",
    f_Gender: "",
    f_Course: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (file) data.append("f_Image", file);

    try {
      await axios.post("http://localhost:5002/employee", data);
      alert("Employee added successfully!");
    } catch (err) {
      alert("Failed to add employee!");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Create Employee</h2>
        <input type="text" name="f_Name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="f_Email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="f_Mobile" placeholder="Mobile" onChange={handleChange} required />
        <select name="f_Designation" onChange={handleChange} required>
          <option value="">Designation</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Sales">Sales</option>
        </select>
        <select name="f_Gender" onChange={handleChange} required>
          <option value="">Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="Other">Other</option>
        </select>
        <select name="f_Course" onChange={handleChange} required>
          <option value="">Course</option>
          <option value="B.Tech">B.Tech</option>
          <option value="MCA">MCA</option>
          <option value="BCA">BCA</option>
          <option value="BSC">BSC</option>
        </select>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EmployeeForm;

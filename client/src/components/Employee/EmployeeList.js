import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./EmployeeList.module.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5002/employees").then((res) => setEmployees(res.data));
  }, []);

  return (
    <div className={styles.container}>
      <h2>Employee List</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>
                <img src={`http://localhost:5002/${emp.f_Image}`} alt={emp.f_Name} />
              </td>
              <td>{emp.f_Name}</td>
              <td>{emp.f_Email}</td>
              <td>{emp.f_Mobile}</td>
              <td>{emp.f_Designation}</td>
              <td>{emp.f_Gender}</td>
              <td>{emp.f_Course}</td>
              <td>
                <button>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;


const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key"; // Replace with .env for better security

// Register an employee
const registerEmployee = async (req, res) => {
  const { name, email, password, position, department, salary } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newEmployee = new Employee({
    name,
    email,
    password: hashedPassword,
    image: req.file ? req.file.path : null,
    position,
    department,
    salary,
  });

  try {
    await newEmployee.save();
    res.json({ message: "Employee registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login an employee
const loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  const employee = await Employee.findOne({ email });
  if (!employee) return res.status(404).json({ error: "Employee not found" });

  const isPasswordValid = await bcrypt.compare(password, employee.password);
  if (!isPasswordValid)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: employee._id }, JWT_SECRET);
  res.json({ token });
};

// Get employee data
const getEmployee = async (req, res) => {
  const employee = await Employee.findById(req.user.id);
  if (!employee) return res.status(404).json({ error: "Employee not found" });

  res.json({
    name: employee.name,
    email: employee.email,
    image: employee.image,
    position: employee.position,
    department: employee.department,
    salary: employee.salary,
  });
};

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

module.exports = {
  registerEmployee,
  loginEmployee,
  getEmployee,
  getAllEmployees,
};

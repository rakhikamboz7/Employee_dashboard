const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = 5002;
const JWT_SECRET = "your_secret_key";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/users", { useNewUrlParser: true, useUnifiedTopology: true });

// Schemas and Models
const UserSchema = new mongoose.Schema({ name: String, email: String, password: String });
const User = mongoose.model("User", UserSchema);

const EmployeeSchema = new mongoose.Schema({
  f_Image: String,
  f_Name: String,
  f_Email: String,
  f_Mobile: String,
  f_Designation: String,
  f_Gender: String,
  f_Course: String,
  f_Createdate: { type: Date, default: Date.now },
});
const Employee = mongoose.model("Employee", EmployeeSchema);

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashedPassword });
  res.status(201).json({ message: "User registered successfully" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET);
  res.json({ token });
});

app.get("/user", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await User.findById(decoded.id);
  res.json({ name: user.name });
});

// Employee CRUD
app.post("/employee", upload.single("f_Image"), async (req, res) => {
  const employeeData = { ...req.body, f_Image: req.file.path };
  await Employee.create(employeeData);
  res.status(201).json({ message: "Employee created successfully" });
});

app.get("/employees", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

app.put("/employee/:id", upload.single("f_Image"), async (req, res) => {
  const updateData = { ...req.body };
  if (req.file) updateData.f_Image = req.file.path;
  await Employee.findByIdAndUpdate(req.params.id, updateData);
  res.json({ message: "Employee updated successfully" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


const express = require("express");
const multer = require("multer");
const { registerEmployee, loginEmployee, getEmployee, getAllEmployees } = require("../controllers/employeeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/register", upload.single("image"), registerEmployee);
router.post("/login", loginEmployee);
router.get("/me", authMiddleware, getEmployee);
router.get("/", getAllEmployees);

module.exports = router;

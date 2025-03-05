const userModel = require("../models/user");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv=require('dotenv');

dotenv.config();
const SignUp = async (req, res) => {
  const { full_name, aadhaar_number, dob, gender,country,dist,loc, zip, phone, email, password,image, feedback, comments,userType } = req.body;
  console.log('====================================');
  console.log(req.body);
  console.log('====================================');

if (isNaN(aadhaar_number)) {
  console.log('====================================');
  console.log(aadhaar_number);
  console.log('====================================');
  return res.status(400).json({ error: 'Invalid Aadhaar number' });
}
  try {
    let user = await userModel.findOne({ aadhaar_number });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const HashPassword = await bcrypt.hash(password, salt);
    const newUser = await userModel.create({
      full_name,
      aadhaar_number,
      dob,
      gender,
      country,
      dist,
      loc,
      zip,
      phone,
      email,
      image,
      password: HashPassword,
      feedback: [],
      comments: [],
      userType
    });


    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({ token, userId: newUser._id, message: "User Registered Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const Login = async (req, res) => {
  const { aadhaar_number } = req.body;
  console.log('====================================');
  console.log(aadhaar_number);
  console.log('====================================');
  // Validate if 'adhar' is provided
  if (!aadhaar_number) {
    return res.status(400).json({ message: "Aadhaar number is required" });
  }

  try {
    // Find user by Aadhaar number
    const user = await userModel.findOne({ aadhaar_number: aadhaar_number });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d", // Token expires in 30 days
    });

    // Send token and userId in response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      userId: user._id,
    });

  } catch (err) {
    // Log and send server error message
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const getProfile = async (req, res) => {
  const { userId } = req.params;

  console.log('====================================');
  console.log("userId", userId);
  console.log('====================================');

  try {
    // Fetch user by ID (no need to parse it)
    const user = await userModel.findById(userId);
    
    // If user does not exist, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is found, return the user data
    return res.status(200).json(user);
  
  } catch (err) {
    // Handle server errors and send a 500 status code with an error message
    return res.status(500).json({ message: "Server error", error: err });
  }
};


const UpdateRating = async (req, res) => {
  try {
    const { id, rating } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { $set: { rating } }, // Correct way to update a field
      { new: true } // Returns updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Rating updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { SignUp, getAllUser , getProfile ,Login , UpdateRating};

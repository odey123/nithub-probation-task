const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
// User Model

// Get all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Register a user
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({message:"User successfully registered", user});
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// user login
router.post("/login", async (req, res) => {
    const secret = process.env.SECRET; 

    try {
        const { email, password } = req.body;

        // Check if email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Check if password is provided
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Compare the password
        const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin,
            },
            secret, 
            { expiresIn: "1d" }
        );
        
        res.status(200).json({ user: user.email, token }); 
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});
// Get a user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

// controllers/authController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('../utils/nodemailer');

// User Registration
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isConfirmed: false,
    });

    // Save the user to the database
    await newUser.save();

    // Send confirmation email
    const subject = 'Please confirm your registration';
    const text = `Hello ${username}, please click on the link to confirm your registration: http://localhost:5000/api/auth/confirm-email/${newUser._id}`;
    nodemailer.sendEmail(email, subject, text);

    res.status(201).json({ message: 'Registration successful. Please check your email to confirm.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Email Confirmation
exports.confirmEmail = async (req, res) => {
  const userId = req.params.userId;
  
  try {
    // Find user by ID and update confirmation status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isConfirmed = true;
    await user.save();

    res.status(200).json({ message: 'Email confirmed successfully. You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the email is confirmed
    if (!user.isConfirmed) {
      return res.status(400).json({ message: 'Please confirm your email before logging in.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

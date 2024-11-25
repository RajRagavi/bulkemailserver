const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
      // Check if the user already exists
      const userExist = await User.findOne({ email });
      if (userExist) {
          return res.status(400).json({ message: 'Email already in use' });
      }

      // Hash password and save user
   const hashedPassword= await bcrypt.hash(password,10)
console.log(hashedPassword);

      const newUser = new User({
          username,
          email,
          password: hashedPassword,

      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
      console.error('Error during registration:', error); // Logs the issue
      res.status(500).json({ message: 'Server error' });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Attempting login with email:', email);  // Log email for debugging

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Log the stored hash for debugging
    console.log('Stored password hash:', user.password);

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Entered password:', password);  // Log entered password for debugging
    console.log('Password match result:', isMatch);  // Log comparison result

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

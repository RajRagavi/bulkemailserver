// routes/authRoutes.js
const express = require('express');
const User = require('../models/userModel');
const router = express.Router();
const authController = require('../controllers/authController');

// User registration route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Other routes
router.get('/confirm-email/:userId', authController.confirmEmail);
router.post('/login', authController.loginUser);

module.exports = router;

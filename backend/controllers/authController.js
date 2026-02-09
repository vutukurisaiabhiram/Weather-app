const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, email, password, passwordConfirm } = req.body;

        // Validation
        if (!username || !email || !password || !passwordConfirm) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password
        });

        // Get token
        const token = user.getSignedJwtToken();

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }

        // Check if user exists
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Get token
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get current logged in user
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

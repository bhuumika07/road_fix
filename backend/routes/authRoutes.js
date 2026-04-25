const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
    try {
        const { email, password, role, passcode } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({ success: false, error: "Email, password, and role are required." });
        }

        if (role === 'admin') {
            if (passcode !== 'admin123') {
                return res.status(401).json({ success: false, error: "Invalid admin passcode." });
            }
        }

        let user = await User.findOne({ email: email });
        
        if (!user) {
            // Create a new user dynamically
            const namePrefix = email.split('@')[0];
            const defaultName = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);
            
            user = new User({
                id: 'user_' + Date.now(),
                name: defaultName,
                email: email,
                password: password,
                role: role
            });
            await user.save();
        } else {
            // Check if password matches
            if (user.password !== password) {
                return res.status(401).json({ success: false, error: "Invalid password." });
            }
            // Update role if they already exist but chose a different role and authenticated
            user.role = role;
            await user.save();
        }
        
        const userData = user.toObject();
        delete userData.password;
        res.json({ success: true, data: userData });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

router.post('/logout', (req, res) => {
    res.json({ success: true });
});

router.get('/me', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const user = await User.findOne({ id: userId });
        
        if (user) {
            const userData = user.toObject();
            delete userData.password;
            res.json({ success: true, data: userData });
        } else {
            res.status(404).json({ success: false, error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

module.exports = router;

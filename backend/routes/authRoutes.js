const express = require('express');
const router = express.Router();

const USERS = [
  { id:"user1", name:"Admin User", email:"admin@roadfix.com", password:"admin123", role:"admin" },
  { id:"user3", name:"Priya Singh", email:"citizen@roadfix.com", password:"citizen123", role:"citizen" }
];

router.post('/login', (req, res) => {
    const { email, password, role, passcode } = req.body;
    
    if (!email || !password || !role) {
        return res.status(400).json({ success: false, error: "Email, password, and role are required." });
    }

    if (role === 'admin') {
        if (passcode !== 'admin123') {
            return res.status(401).json({ success: false, error: "Invalid admin passcode." });
        }
    }

    let user = USERS.find(u => u.email === email);
    
    if (!user) {
        // Create a new user dynamically
        const namePrefix = email.split('@')[0];
        const defaultName = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);
        
        user = {
            id: 'user_' + Date.now(),
            name: defaultName,
            email: email,
            password: password,
            role: role
        };
        USERS.push(user);
    } else {
        // Check if password matches
        if (user.password !== password) {
            return res.status(401).json({ success: false, error: "Invalid password." });
        }
        // Update role if they already exist but chose a different role and authenticated
        user.role = role;
    }
    
    const { password: userPassword, ...userData } = user;
    res.json({ success: true, data: userData });
});

router.post('/logout', (req, res) => {
    // True session invalidation could be managed here with tokens/cookies.
    // For local storage implementation, backend acknowledges the logout request.
    res.json({ success: true });
});

router.get('/me', (req, res) => {
    const userId = req.headers['x-user-id'];
    const user = USERS.find(u => u.id === userId);
    
    if (user) {
        const { password, ...userData } = user;
        res.json({ success: true, data: userData });
    } else {
        res.status(404).json({ success: false, error: "User not found" });
    }
});

module.exports = router;

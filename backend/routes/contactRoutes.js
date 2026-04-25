const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if(!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, error: 'All fields are required.' });
        }
        
        // Email formatting validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
        }

        if(message.length < 20) {
            return res.status(400).json({ success: false, error: 'Message must be at least 20 characters.' });
        }

        const newMessage = new ContactMessage({
            id: Date.now().toString(),
            name,
            email,
            subject,
            message
        });

        await newMessage.save();

        res.json({ success: true, data: { message: 'Sent!' } });
    } catch(err) {
        console.error('Contact POST Error:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;

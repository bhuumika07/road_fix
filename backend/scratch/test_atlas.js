const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
require('dotenv').config();

async function testConnection() {
    try {
        await connectDB();
        console.log('--- Database Verification Started ---');

        // Create a test user
        const testEmail = `test_${Date.now()}@roadfix.com`;
        const newUser = new User({
            id: 'user_test_' + Date.now(),
            name: 'Atlas Test User',
            email: testEmail,
            password: 'password123',
            role: 'citizen'
        });

        await newUser.save();
        console.log('✅ Success: Test user created in MongoDB Atlas!');
        console.log(`📧 Email: ${testEmail}`);

        // Verify it was saved
        const found = await User.findOne({ email: testEmail });
        if (found) {
            console.log('✅ Success: Verified user exists in the cloud.');
        }

        await mongoose.connection.close();
        console.log('--- Database Verification Complete ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
        process.exit(1);
    }
}

testConnection();

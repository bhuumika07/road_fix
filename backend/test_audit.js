const mongoose = require('mongoose');
require('dotenv').config();
const AuditLog = require('./models/AuditLog');

const test = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        console.log('Fetching logs...');
        const logs = await AuditLog.find().sort({ createdAt: -1 });
        console.log('Logs found:', logs.length);
        if (logs.length > 0) {
            console.log('First log:', JSON.stringify(logs[0], null, 2));
        }
        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
};

test();

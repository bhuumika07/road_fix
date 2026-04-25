const mongoose = require('mongoose');
require('dotenv').config();
const Report = require('./models/Report');

const test = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        console.log('Fetching reports...');
        const reports = await Report.find();
        console.log('Reports found:', reports.length);
        if (reports.length > 0) {
            reports.forEach(r => {
                console.log(`Report #${r.id}: upvotedBy = ${JSON.stringify(r.upvotedBy)}`);
            });
        }
        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
};

test();

const mongoose = require('mongoose');
require('dotenv').config();
const Report = require('./models/Report');

const test = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const id = 1;
        const userId = "user_test_antigravity";

        console.log(`Simulating upvote for Report #${id} by ${userId}...`);
        const existing = await Report.findOne({ id: id });
        if (!existing) throw new Error('Report not found');

        if (!existing.upvotedBy) existing.upvotedBy = [];
        
        const index = existing.upvotedBy.indexOf(userId);
        if (index === -1) {
            console.log('User not in list, adding...');
            existing.upvotedBy.push(userId);
        } else {
            console.log('User already in list, removing...');
            existing.upvotedBy.splice(index, 1);
        }

        await existing.save();
        console.log('Save successful. New upvotedBy:', JSON.stringify(existing.upvotedBy));

        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
};

test();

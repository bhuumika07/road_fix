const mongoose = require('mongoose');
require('dotenv').config();
const Report = require('./models/Report');

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const reports = await Report.find().sort({ createdAt: -1 });
        reports.forEach(r => {
            console.log(`ID: ${r.id}, Title: ${r.title}, Upvotes: ${r.upvotedBy.length}`);
        });
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
};

test();

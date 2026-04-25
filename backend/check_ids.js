const mongoose = require('mongoose');
require('dotenv').config();
const Report = require('./models/Report');

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const reports = await Report.find();
        reports.forEach(r => {
            console.log(`id: ${r.id}, _id: ${r._id}, upvotedBy: ${JSON.stringify(r.upvotedBy)}`);
        });
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
};

test();

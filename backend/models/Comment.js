const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // 'comment-timestamp-random'
    reportId: { type: String, required: true },
    text: { type: String, required: true },
    author: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);

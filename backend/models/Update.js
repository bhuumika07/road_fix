const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // 'update-timestamp-random'
    reportId: { type: String, required: true },
    text: { type: String, required: true },
    author: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Update', updateSchema);

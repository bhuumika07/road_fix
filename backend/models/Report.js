const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Keeping numeric ID to not break frontend
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, default: '' },
    image_url: { type: String, default: null },
    status: { type: String, default: 'Reported' },
    solution: { type: String, default: null },
    upvotedBy: { type: [String], default: [] }, // Array of user IDs
}, { timestamps: true });

// Add a pre-save hook to ensure createdAt and created_at are aligned if needed for frontend
// But timestamps: true will add createdAt and updatedAt automatically.
// The frontend uses createdAt, so we are good.

module.exports = mongoose.model('Report', reportSchema);

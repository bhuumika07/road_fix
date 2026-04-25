const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keeping string ID format ('user_1234')
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

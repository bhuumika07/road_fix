const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // 'log_timestamp'
    action: { type: String, required: true },
    actor: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, required: true }
    },
    reportId: { type: String, required: true },
    details: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);

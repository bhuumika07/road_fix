const fs = require('fs');
const path = require('path');

const auditPath = path.join(__dirname, 'auditLogs.txt');

if (!fs.existsSync(auditPath)) {
    fs.writeFileSync(auditPath, JSON.stringify([]), 'utf-8');
}

const readAuditLogs = () => {
    try {
        const raw = fs.readFileSync(auditPath, 'utf-8');
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        console.error('Error reading audit logs:', err.message);
        return [];
    }
};

const writeAuditLogs = (logs) => {
    try {
        fs.writeFileSync(auditPath, JSON.stringify(logs, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error writing audit logs:', err.message);
    }
};

const appendAuditLog = ({ action, actor, reportId, details }) => {
    const logs = readAuditLogs();

    const newEntry = {
        id: Date.now().toString(),
        action: action || 'unknown.action',
        actor: actor || { id: 'unknown', name: 'Unknown User', role: 'unknown' },
        reportId: reportId || null,
        details: details || '',
        timestamp: new Date().toISOString()
    };

    logs.push(newEntry);
    writeAuditLogs(logs);
    return newEntry;
};

const getAllAuditLogs = () => {
    const logs = readAuditLogs();
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

module.exports = {
    appendAuditLog,
    getAllAuditLogs
};

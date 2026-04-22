const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'community.txt');

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ comments: [], updates: [] }, null, 2), 'utf-8');
}

const readStore = () => {
    try {
        const raw = fs.readFileSync(dbPath, 'utf-8');
        const parsed = raw ? JSON.parse(raw) : {};
        return {
            comments: Array.isArray(parsed.comments) ? parsed.comments : [],
            updates: Array.isArray(parsed.updates) ? parsed.updates : []
        };
    } catch (err) {
        console.error('Error reading community data:', err.message);
        return { comments: [], updates: [] };
    }
};

const writeStore = (store) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(store, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error writing community data:', err.message);
    }
};

const buildId = (prefix) => `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}`;

const addComment = ({ reportId, text, author }) => {
    const store = readStore();
    const record = {
        id: buildId('comment'),
        reportId: reportId.toString(),
        text: text || '',
        author: author || { id: 'unknown', name: 'Unknown User', role: 'unknown' },
        createdAt: new Date().toISOString()
    };

    store.comments.push(record);
    writeStore(store);
    return record;
};

const addOfficialUpdate = ({ reportId, text, author }) => {
    const store = readStore();
    const record = {
        id: buildId('update'),
        reportId: reportId.toString(),
        text: text || '',
        author: author || { id: 'unknown', name: 'Unknown Official', role: 'unknown' },
        createdAt: new Date().toISOString()
    };

    store.updates.push(record);
    writeStore(store);
    return record;
};

const getCommentsByReportId = (reportId) => {
    const store = readStore();
    return store.comments
        .filter((entry) => entry.reportId.toString() === reportId.toString())
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

const getUpdatesByReportId = (reportId) => {
    const store = readStore();
    return store.updates
        .filter((entry) => entry.reportId.toString() === reportId.toString())
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

module.exports = {
    addComment,
    addOfficialUpdate,
    getCommentsByReportId,
    getUpdatesByReportId
};

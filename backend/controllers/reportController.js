const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const Report = require('../models/Report');
const AuditLog = require('../models/AuditLog');
const Comment = require('../models/Comment');
const Update = require('../models/Update');

let io;
const setIO = (socketIO) => { io = socketIO; };

const getActor = (req) => ({
    id: req.headers['x-user-id'] || 'unknown',
    name: req.headers['x-user-name'] || 'Unknown User',
    role: req.headers['x-user-role'] || 'unknown'
});

const uploadToImgBB = async (filePath) => {
    try {
        const apiKey = process.env.IMGBB_API_KEY;
        if (!apiKey) return null;

        const form = new FormData();
        form.append('image', fs.createReadStream(filePath));

        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, form, {
            headers: form.getHeaders()
        });

        if (response.data && response.data.success) {
            return response.data.data.url;
        }
        return null;
    } catch (error) {
        console.error('ImgBB Upload Error:', error.message);
        return null;
    }
};

const appendAuditLog = async ({ action, actor, reportId, details }) => {
    try {
        const newEntry = new AuditLog({
            id: 'log_' + Date.now(),
            action: action || 'unknown.action',
            actor: actor || { id: 'unknown', name: 'Unknown User', role: 'unknown' },
            reportId: reportId || null,
            details: details || ''
        });
        await newEntry.save();
        return newEntry;
    } catch (err) {
        console.error('Error appending audit log:', err.message);
    }
};

const getReports = async (req, res) => {
    try {
        const { category, status } = req.query;
        let query = {};
        if (category) query.category = category;
        if (status) query.status = status;
        
        const records = await Report.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: records });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createReport = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Request body is empty.' });
        }

        const { title, description, category, latitude, longitude, address } = req.body;
        let image_url = req.body.image_url;

        if (!title || !category) {
            return res.status(400).json({ error: 'Title and category are required.' });
        }

        if (req.file) {
            const cloudUrl = await uploadToImgBB(req.file.path);
            if (cloudUrl) {
                image_url = cloudUrl;
                // Delete local file after upload
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting local file:', err);
                });
            } else {
                // Fallback to local if cloud fails
                image_url = `/uploads/${req.file.filename}`;
            }
        }

        // Get highest ID for auto-increment simulation
        const lastReport = await Report.findOne().sort({ id: -1 });
        const newId = lastReport ? lastReport.id + 1 : 1;

        const newReport = new Report({
            id: newId,
            title,
            description,
            category,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            address,
            image_url,
            status: 'Reported',
            upvotedBy: []
        });

        await newReport.save();
        
        const actor = getActor(req);
        await appendAuditLog({
            action: 'report.created',
            actor: actor,
            reportId: newId.toString(),
            details: `Report #${newId} titled '${title}' submitted in category ${category}`
        });

        if (io) io.emit('report:new', newReport);

        res.status(201).json({
            success: true,
            data: { reportId: newId }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, solution } = req.body;

        if (!status) return res.status(400).json({ error: 'Status is required.' });

        const existing = await Report.findOne({ id: id });
        if (!existing) return res.status(404).json({ error: 'Report not found' });
        
        const oldStatus = existing.status;
        existing.status = status;
        if (solution !== undefined) existing.solution = solution;

        await existing.save();

        await appendAuditLog({
            action: 'report.status_changed',
            actor: getActor(req),
            reportId: id.toString(),
            details: `Status changed from ${oldStatus} to ${status} for report #${id}`
        });

        if (io) io.emit('report:updated', existing);

        res.json({ success: true, message: 'Status updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const upvoteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers['x-user-id'];

        if (!userId) return res.status(400).json({ success: false, error: 'User ID required for upvoting' });

        const existing = await Report.findOne({ id: id });
        if (!existing) return res.status(404).json({ error: 'Report not found' });

        if (!existing.upvotedBy) existing.upvotedBy = [];
        
        const index = existing.upvotedBy.indexOf(userId);
        if (index === -1) {
            existing.upvotedBy.push(userId);
        } else {
            existing.upvotedBy.splice(index, 1);
        }

        await existing.save();

        if (io) io.emit('report:upvoted', { id, upvotes: existing.upvotedBy.length, upvotedBy: existing.upvotedBy });

        res.json({ success: true, upvotes: existing.upvotedBy.length, isUpvoted: index === -1 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getReportStats = async (req, res) => {
    try {
        const reports = await Report.find();
        const statsObj = reports.reduce((acc, report) => {
            acc[report.status] = (acc[report.status] || 0) + 1;
            return acc;
        }, {});
        
        const stats = Object.keys(statsObj).map(status => ({ status, count: statsObj[status] }));
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getReportComments = async (req, res) => {
    try {
        const { id } = req.params;
        const foundReport = await Report.findOne({ id: id });
        if (!foundReport) return res.status(404).json({ success: false, error: 'Report not found' });

        const comments = await Comment.find({ reportId: id.toString() }).sort({ createdAt: 1 });
        return res.json({ success: true, data: comments });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const createReportComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body || {};
        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, error: 'Comment text is required.' });
        }

        const foundReport = await Report.findOne({ id: id });
        if (!foundReport) return res.status(404).json({ success: false, error: 'Report not found' });

        const actor = getActor(req);
        const comment = new Comment({
            id: 'comment-' + Date.now() + '-' + Math.round(Math.random() * 1e6),
            reportId: id.toString(),
            text: text.trim(),
            author: actor
        });

        await comment.save();

        await appendAuditLog({
            action: 'report.comment_added',
            actor,
            reportId: id.toString(),
            details: `Comment added to report #${id}`
        });

        if (io) io.emit('report:commented', { reportId: id.toString(), comment });
        return res.status(201).json({ success: true, data: comment });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getReportUpdates = async (req, res) => {
    try {
        const { id } = req.params;
        const foundReport = await Report.findOne({ id: id });
        if (!foundReport) return res.status(404).json({ success: false, error: 'Report not found' });

        const updates = await Update.find({ reportId: id.toString() }).sort({ createdAt: 1 });
        return res.json({ success: true, data: updates });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const createReportUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body || {};
        const actor = getActor(req);

        if (actor.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Only officials can post updates.' });
        }
        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, error: 'Update text is required.' });
        }

        const foundReport = await Report.findOne({ id: id });
        if (!foundReport) return res.status(404).json({ success: false, error: 'Report not found' });

        const update = new Update({
            id: 'update-' + Date.now() + '-' + Math.round(Math.random() * 1e6),
            reportId: id.toString(),
            text: text.trim(),
            author: actor
        });

        await update.save();

        await appendAuditLog({
            action: 'report.update_posted',
            actor,
            reportId: id.toString(),
            details: `Official update posted for report #${id}`
        });

        if (io) io.emit('report:updated_note', { reportId: id.toString(), update });
        return res.status(201).json({ success: true, data: update });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Report.deleteOne({ id: id });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        await appendAuditLog({
            action: 'report.deleted',
            actor: getActor(req),
            reportId: id.toString(),
            details: `Report #${id} permanently deleted`
        });

        if (io) io.emit('report:deleted', { id });

        res.json({ success: true, message: 'Report deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    setIO,
    getReports,
    createReport,
    updateReportStatus,
    getReportStats,
    deleteReport,
    upvoteReport,
    getReportComments,
    createReportComment,
    getReportUpdates,
    createReportUpdate
};

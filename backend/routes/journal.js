const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
    try {
        const entries = await Journal.find({ user: req.user.id });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', protect, async (req, res) => {
    const entry = new Journal({
        user: req.user.id,
        date: req.body.date,
        content: req.body.content,
        mood: req.body.mood,
        remarks: req.body.remarks
    });
    try {
        const newEntry = await entry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update/Edit an entry (often used if user saves again on same day, or edits)
router.put('/:id', protect, async (req, res) => {
    try {
        const entry = await Journal.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });

        // Check user
        if (entry.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        Object.assign(entry, req.body);
        const updatedEntry = await entry.save();
        res.json(updatedEntry);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
    try {
        const badges = await Badge.find();
        res.json(badges);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST to initialize default badges if needed (or could be seeded)
router.post('/', protect, async (req, res) => {
    const badge = new Badge(req.body);
    try {
        const newBadge = await badge.save();
        res.status(201).json(newBadge);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

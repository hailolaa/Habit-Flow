const express = require('express');
const router = express.Router();
const UserStats = require('../models/UserStats');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
    try {
        const stats = await UserStats.getSingleton(req.user.id);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/', protect, async (req, res) => {
    try {
        let stats = await UserStats.getSingleton(req.user.id);
        Object.assign(stats, req.body);
        const updatedStats = await stats.save();
        res.json(updatedStats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

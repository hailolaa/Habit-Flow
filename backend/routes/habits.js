const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const { protect } = require('../middleware/authMiddleware');

// GET all habits
router.get('/', protect, async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.user.id });
        res.json(habits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new habit
router.post('/', protect, async (req, res) => {
    const habit = new Habit({
        user: req.user.id,
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        completedDays: []
    });

    try {
        const newHabit = await habit.save();
        res.status(201).json(newHabit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update a habit (e.g. toggle completion)
router.put('/:id', protect, async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        // Check user
        if (habit.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (req.body.completedDays) {
            habit.completedDays = req.body.completedDays;
        }
        // Add other fields as needed

        const updatedHabit = await habit.save();
        res.json(updatedHabit);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a habit
router.delete('/:id', protect, async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        // Check user
        if (habit.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await habit.deleteOne();
        res.json({ message: 'Habit deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

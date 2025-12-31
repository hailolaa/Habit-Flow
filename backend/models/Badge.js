const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String, required: true },
    unlockedAt: { type: Date },
    requirement: {
        type: { type: String, enum: ['streak', 'total', 'goals', 'journal'], required: true },
        count: { type: Number, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);

const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalHabitsCompleted: { type: Number, default: 0 },
    totalGoalsCompleted: { type: Number, default: 0 },
    totalJournalEntries: { type: Number, default: 0 },
    lastLoginDate: { type: String }, // For daily streak calculation
}, { timestamps: true });

// Singleton pattern helper for stats
userStatsSchema.statics.getSingleton = async function (userId) {
    let stats = await this.findOne({ user: userId });
    if (!stats) {
        stats = await this.create({ user: userId });
    }
    return stats;
};

module.exports = mongoose.model('UserStats', userStatsSchema);

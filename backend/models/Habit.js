const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    icon: { type: String, default: '📝' },
    color: { type: String, default: 'primary' },
    completedDays: [{ type: String }], // ISO date strings 'YYYY-MM-DD'
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

module.exports = mongoose.model('Habit', habitSchema);

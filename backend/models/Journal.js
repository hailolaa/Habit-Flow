const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // ISO date string 'YYYY-MM-DD'
    content: { type: String, required: true },
    mood: { type: String, enum: ['great', 'good', 'okay', 'bad', 'terrible'], default: 'okay' },
    remarks: { type: String },
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

module.exports = mongoose.model('Journal', journalSchema);

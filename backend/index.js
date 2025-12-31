require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Enable wildcard OR allow any vercel/localhost origin for ease of deployment
        if (allowedOrigins.includes('*') ||
            allowedOrigins.indexOf(origin) !== -1 ||
            origin.includes('vercel.app') ||
            origin.includes('localhost')) {
            return callback(null, true);
        } else {
            console.log('Blocked Origin:', origin);
            return callback(null, false); // Don't throw error, just don't allow
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@habit-flow.0jzqz.mongodb.net/habit-flow?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/todos', require('./routes/todos'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/badges', require('./routes/badges'));
app.use('/api/stats', require('./routes/userStats'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

require('dotenv').config();
const mongoose = require('mongoose');

// Use the same URI logic as index.js
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@habit-flow.0jzqz.mongodb.net/habit-flow?retryWrites=true&w=majority';

console.log('--- MongoDB Connection Test ---');
console.log('URI:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

const mongooseOptions = {
    serverSelectionTimeoutMS: 5000,
    family: 4, // Force IPv4
};

async function testConnection() {
    try {
        console.log('Attempting connection...');
        await mongoose.connect(MONGODB_URI, mongooseOptions);
        console.log('✅ Success! Connected to MongoDB.');
        console.log('The backend should work. If it fails, restart the backend server.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed.');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);

        if (err.message.includes('ENOTFOUND')) {
            console.error('\nDiagnosis: DNS Error (ENOTFOUND)');
            console.error('Your computer cannot resolve the MongoDB Atlas address.');
            console.error('Potential Solutions:');
            console.error('1. Check your internet connection.');
            console.error('2. Try using a different DNS (e.g., Google DNS 8.8.8.8).');
            console.error('3. Your network firewall might be blocking SRV records.');
        } else if (err.message.includes('bad auth')) {
            console.error('\nDiagnosis: Authentication Failed');
            console.error('Check your username and password in the connection string.');
        } else {
            console.error('\nDiagnosis: Network/Firewall Issue');
            console.error('Ensure your IP address is whitelisted in MongoDB Atlas Network Access.');
        }
        process.exit(1);
    }
}

testConnection();

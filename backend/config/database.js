const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error('Please check:');
        console.error('1. MongoDB Atlas IP whitelist (Network Access)');
        console.error('2. Database credentials are correct');
        console.error('3. Cluster is running and accessible');
        process.exit(1);
    }
};

module.exports = connectDB;

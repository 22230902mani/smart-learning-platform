require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const connectDB = require(path.join(__dirname, '..', 'config', 'database'));
const User = require(path.join(__dirname, '..', 'models', 'User'));

const createTestUser = async () => {
    try {
        console.log('👤 Creating test user...\n');

        // Connect to database
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'test@example.com' });

        if (existingUser) {
            console.log('ℹ️  Test user already exists!');
            console.log('📧 Email: test@example.com');
            console.log('🔑 Password: Test123!');
            console.log('👤 Role: student\n');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Test123!', salt);

        // Create test user
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword,
            role: 'student',
            isApproved: true
        });

        console.log('✅ Test user created successfully!\n');
        console.log('📧 Email: test@example.com');
        console.log('🔑 Password: Test123!');
        console.log('👤 Role: student');
        console.log(`🆔 User ID: ${user._id}\n`);
        console.log('You can now login with these credentials!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating test user:', error);
        process.exit(1);
    }
};

// Run the script
createTestUser();

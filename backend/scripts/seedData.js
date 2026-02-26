require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-learning-platform')
    .then(() => console.log('✓ Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import models
const User = require('../models/User');
const Topic = require('../models/Topic');
const Question = require('../models/Question');

const seedData = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        await User.deleteMany({});
        await Topic.deleteMany({});
        await Question.deleteMany({});
        console.log('✓ Cleared existing data\n');

        // Create Admin User
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('✓ Created admin user: admin@example.com / admin123');

        // Create Student User
        const studentUser = await User.create({
            name: 'John Student',
            email: 'student@example.com',
            password: 'student123',
            role: 'student'
        });
        console.log('✓ Created student user: student@example.com / student123\n');

        // Create Topics
        const topics = await Topic.insertMany([
            {
                subject: 'JavaScript',
                topic: 'ES6 Features',
                subtopic: 'Arrow Functions',
                concept: 'Basic Syntax',
                description: 'Understanding arrow function syntax and usage'
            },
            {
                subject: 'JavaScript',
                topic: 'ES6 Features',
                subtopic: 'Arrow Functions',
                concept: 'This Binding',
                description: 'How this works in arrow functions'
            },
            {
                subject: 'JavaScript',
                topic: 'Async Programming',
                subtopic: 'Promises',
                concept: 'Promise Basics',
                description: 'Understanding Promise creation and usage'
            },
            {
                subject: 'JavaScript',
                topic: 'Async Programming',
                subtopic: 'Async Await',
                concept: 'Async Function Syntax',
                description: 'Using async/await for cleaner async code'
            },
            {
                subject: 'React',
                topic: 'Hooks',
                subtopic: 'useState',
                concept: 'State Management',
                description: 'Managing component state with useState'
            },
            {
                subject: 'React',
                topic: 'Hooks',
                subtopic: 'useEffect',
                concept: 'Side Effects',
                description: 'Handling side effects in React components'
            },
            {
                subject: 'Node.js',
                topic: 'Express',
                subtopic: 'Routing',
                concept: 'Route Parameters',
                description: 'Working with route parameters in Express'
            },
            {
                subject: 'Node.js',
                topic: 'Express',
                subtopic: 'Middleware',
                concept: 'Custom Middleware',
                description: 'Creating custom middleware functions'
            },
            {
                subject: 'MongoDB',
                topic: 'Mongoose',
                subtopic: 'Schemas',
                concept: 'Schema Definition',
                description: 'Defining Mongoose schemas'
            },
            {
                subject: 'MongoDB',
                topic: 'Queries',
                subtopic: 'Find Operations',
                concept: 'Query Filters',
                description: 'Using filters in MongoDB queries'
            }
        ]);
        console.log(`✓ Created ${topics.length} topics\n`);

        // Create Questions
        const questions = [
            {
                topicId: topics[0]._id,
                questionText: 'What is the correct syntax for an arrow function in JavaScript?',
                options: [
                    { text: '() => {}', isCorrect: true },
                    { text: 'function() {}', isCorrect: false },
                    { text: '() -> {}', isCorrect: false },
                    { text: '=> () {}', isCorrect: false }
                ],
                correctAnswer: '() => {}',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['javascript', 'es6', 'functions'],
                expectedTime: 30,
                explanation: 'Arrow functions use the syntax () => {} in JavaScript ES6. The arrow (=>) separates parameters from the function body.',
                hints: ['Think about the arrow symbol =>', 'Parameters go before the arrow'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics[0]._id,
                questionText: 'Which statement about arrow functions is TRUE?',
                options: [
                    { text: 'Arrow functions have their own this binding', isCorrect: false },
                    { text: 'Arrow functions inherit this from parent scope', isCorrect: true },
                    { text: 'Arrow functions cannot return values', isCorrect: false },
                    { text: 'Arrow functions require the return keyword', isCorrect: false }
                ],
                correctAnswer: 'Arrow functions inherit this from parent scope',
                difficulty: 'medium',
                difficultyScore: 5,
                tags: ['javascript', 'es6', 'this', 'scope'],
                expectedTime: 45,
                explanation: 'Arrow functions do not have their own this context. They inherit this from the enclosing lexical scope.',
                hints: ['Think about how this behaves differently from regular functions'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics[2]._id,
                questionText: 'How do you create a new Promise in JavaScript?',
                options: [
                    { text: 'new Promise()', isCorrect: false },
                    { text: 'Promise.create()', isCorrect: false },
                    { text: 'new Promise((resolve, reject) => {})', isCorrect: true },
                    { text: 'Promise((resolve, reject) => {})', isCorrect: false }
                ],
                correctAnswer: 'new Promise((resolve, reject) => {})',
                difficulty: 'easy',
                difficultyScore: 3,
                tags: ['javascript', 'promises', 'async'],
                expectedTime: 30,
                explanation: 'A Promise is created using the new Promise() constructor with a callback that receives resolve and reject functions.',
                hints: ['Promises use a constructor', 'The callback takes two parameters'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics[3]._id,
                questionText: 'What does the await keyword do?',
                options: [
                    { text: 'Creates a new Promise', isCorrect: false },
                    { text: 'Pauses execution until Promise resolves', isCorrect: true },
                    { text: 'Catches Promise errors', isCorrect: false },
                    { text: 'Rejects a Promise', isCorrect: false }
                ],
                correctAnswer: 'Pauses execution until Promise resolves',
                difficulty: 'medium',
                difficultyScore: 4,
                tags: ['javascript', 'async', 'await'],
                expectedTime: 40,
                explanation: 'The await keyword pauses the execution of an async function until the Promise is resolved or rejected.',
                hints: ['Think about what async/await does to code flow'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics[4]._id,
                questionText: 'How do you update state in a React component using useState?',
                options: [
                    { text: 'state.value = newValue', isCorrect: false },
                    { text: 'setState(newValue)', isCorrect: true },
                    { text: 'useState.update(newValue)', isCorrect: false },
                    { text: 'updateState(newValue)', isCorrect: false }
                ],
                correctAnswer: 'setState(newValue)',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['react', 'hooks', 'state'],
                expectedTime: 30,
                explanation: 'useState returns an array with [state, setState]. Call setState with the new value to update state.',
                hints: ['useState returns two things in an array'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics[5]._id,
                questionText: 'When does useEffect run by default?',
                options: [
                    { text: 'Only on component mount', isCorrect: false },
                    { text: 'After every render', isCorrect: true },
                    { text: 'Only when props change', isCorrect: false },
                    { text: 'Only on component unmount', isCorrect: false }
                ],
                correctAnswer: 'After every render',
                difficulty: 'medium',
                difficultyScore: 5,
                tags: ['react', 'hooks', 'useeffect'],
                expectedTime: 45,
                explanation: 'By default, useEffect runs after every render. You can control this with the dependency array.',
                hints: ['Think about what happens without a dependency array'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics[6]._id,
                questionText: 'How do you access route parameters in Express?',
                options: [
                    { text: 'req.params', isCorrect: true },
                    { text: 'req.query', isCorrect: false },
                    { text: 'req.body', isCorrect: false },
                    { text: 'req.parameters', isCorrect: false }
                ],
                correctAnswer: 'req.params',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['nodejs', 'express', 'routing'],
                expectedTime: 30,
                explanation: 'Route parameters (like :id in /user/:id) are accessible via req.params object.',
                hints: ['Think about the request object properties'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics[7]._id,
                questionText: 'What is the correct order for middleware execution in Express?',
                options: [
                    { text: 'Bottom to top', isCorrect: false },
                    { text: 'Top to bottom', isCorrect: true },
                    { text: 'Random order', isCorrect: false },
                    { text: 'Alphabetical order', isCorrect: false }
                ],
                correctAnswer: 'Top to bottom',
                difficulty: 'easy',
                difficultyScore: 3,
                tags: ['nodejs', 'express', 'middleware'],
                expectedTime: 30,
                explanation: 'Express executes middleware in the order they are defined in your code, from top to bottom.',
                hints: ['Think about the order you write app.use() statements'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics[8]._id,
                questionText: 'How do you define a required field in a Mongoose schema?',
                options: [
                    { text: 'fieldName: { required: true }', isCorrect: true },
                    { text: 'fieldName: { mandatory: true }', isCorrect: false },
                    { text: 'fieldName: { type: Required }', isCorrect: false },
                    { text: 'fieldName: required', isCorrect: false }
                ],
                correctAnswer: 'fieldName: { required: true }',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['mongodb', 'mongoose', 'schema'],
                expectedTime: 30,
                explanation: 'In Mongoose schemas, you set required: true in the field definition object to make a field mandatory.',
                hints: ['Look at the options object for fields'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics[9]._id,
                questionText: 'Which method returns multiple documents in MongoDB?',
                options: [
                    { text: 'findOne()', isCorrect: false },
                    { text: 'find()', isCorrect: true },
                    { text: 'get()', isCorrect: false },
                    { text: 'select()', isCorrect: false }
                ],
                correctAnswer: 'find()',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['mongodb', 'queries'],
                expectedTime: 30,
                explanation: 'The find() method returns all documents matching the query, while findOne() returns only one.',
                hints: ['Think about the difference between find and findOne'],
                status: 'active',
                createdBy: adminUser._id
            },
            // Add more challenging questions
            {
                topicId: topics[1]._id,
                questionText: 'In which scenario should you NOT use arrow functions?',
                options: [
                    { text: 'Array methods like map, filter', isCorrect: false },
                    { text: 'Object methods that need this', isCorrect: true },
                    { text: 'Callback functions', isCorrect: false },
                    { text: 'Promise handlers', isCorrect: false }
                ],
                correctAnswer: 'Object methods that need this',
                difficulty: 'hard',
                difficultyScore: 7,
                tags: ['javascript', 'es6', 'this', 'best-practices'],
                expectedTime: 60,
                explanation: 'Arrow functions should not be used as object methods when you need access to the object via this, because arrow functions don\'t have their own this binding.',
                hints: ['Think about how this behaves in arrow functions', 'Consider object method context'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics[3]._id,
                questionText: 'What happens if you forget to use await with an async function?',
                options: [
                    { text: 'Syntax error', isCorrect: false },
                    { text: 'Runtime error', isCorrect: false },
                    { text: 'You get a Promise instead of the value', isCorrect: true },
                    { text: 'Nothing, it works the same', isCorrect: false }
                ],
                correctAnswer: 'You get a Promise instead of the value',
                difficulty: 'medium',
                difficultyScore: 6,
                tags: ['javascript', 'async', 'promises'],
                expectedTime: 50,
                explanation: 'Without await, you receive a pending Promise instead of the resolved value. Always use await when you need the actual result.',
                hints: ['Async functions always return Promises'],
                status: 'active',
                createdBy: adminUser._id
            }
        ];

        await Question.insertMany(questions);
        console.log(`✓ Created ${questions.length} questions\n`);

        console.log('✅ Database seeding completed successfully!\n');
        console.log('═══════════════════════════════════════');
        console.log('LOGIN CREDENTIALS:');
        console.log('───────────────────────────────────────');
        console.log('Admin:   admin@example.com / admin123');
        console.log('Student: student@example.com / student123');
        console.log('═══════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();

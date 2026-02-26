require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require(path.join(__dirname, '..', 'config', 'database'));
const Question = require(path.join(__dirname, '..', 'models', 'Question'));
const Topic = require(path.join(__dirname, '..', 'models', 'Topic'));

// Sample topics
const sampleTopics = [
    {
        subject: 'JavaScript',
        topic: 'Arrays',
        subtopic: 'Array Manipulation',
        concept: 'Array Methods',
        description: 'Understanding JavaScript array manipulation methods'
    },
    {
        subject: 'JavaScript',
        topic: 'Functions',
        subtopic: 'Modern Functions',
        concept: 'Arrow Functions',
        description: 'ES6 arrow functions and their behavior'
    },
    {
        subject: 'JavaScript',
        topic: 'Asynchronous',
        subtopic: 'Promises',
        concept: 'Async/Await',
        description: 'Asynchronous programming with promises and async/await'
    },
    {
        subject: 'React',
        topic: 'Hooks',
        subtopic: 'State Management',
        concept: 'useState',
        description: 'Managing state in functional components'
    },
    {
        subject: 'React',
        topic: 'Hooks',
        subtopic: 'Side Effects',
        concept: 'useEffect',
        description: 'Side effects in React components'
    }
];

// Sample questions (will be created after topics)
const getSampleQuestions = (topics) => [
    {
        topicId: topics[0]._id,
        questionText: 'Which array method creates a new array with the results of calling a function for every element?',
        questionType: 'multiple-choice',
        options: [
            { text: 'map()', isCorrect: true },
            { text: 'forEach()', isCorrect: false },
            { text: 'filter()', isCorrect: false },
            { text: 'reduce()', isCorrect: false }
        ],
        correctAnswer: 'map()',
        explanation: 'The map() method creates a new array with the results of calling a provided function on every element in the calling array.',
        difficulty: 'easy',
        expectedTime: 45,
        hints: ['This method returns a new array', 'It transforms each element'],
        tags: ['arrays', 'methods', 'map'],
        status: 'active'
    },
    {
        topicId: topics[0]._id,
        questionText: 'What does the filter() method return?',
        questionType: 'multiple-choice',
        options: [
            { text: 'A new array with elements that pass the test', isCorrect: true },
            { text: 'The first element that passes the test', isCorrect: false },
            { text: 'True or false', isCorrect: false },
            { text: 'The modified original array', isCorrect: false }
        ],
        correctAnswer: 'A new array with elements that pass the test',
        explanation: 'The filter() method creates a new array with all elements that pass the test implemented by the provided function.',
        difficulty: 'easy',
        expectedTime: 40,
        hints: ['It creates a new array', 'Elements must pass a condition'],
        tags: ['arrays', 'filter'],
        status: 'active'
    },
    {
        topicId: topics[1]._id,
        questionText: 'What is the main difference between arrow functions and regular functions regarding "this"?',
        questionType: 'multiple-choice',
        options: [
            { text: 'Arrow functions do not have their own "this" binding', isCorrect: true },
            { text: 'Arrow functions have a stronger "this" binding', isCorrect: false },
            { text: 'There is no difference', isCorrect: false },
            { text: 'Arrow functions create a new "this" context', isCorrect: false }
        ],
        correctAnswer: 'Arrow functions do not have their own "this" binding',
        explanation: 'Arrow functions do not have their own "this" binding. They inherit "this" from the enclosing scope.',
        difficulty: 'medium',
        expectedTime: 60,
        hints: ['Think about lexical scoping', 'Arrow functions inherit context'],
        tags: ['functions', 'arrow-functions', 'this'],
        status: 'active'
    },
    {
        topicId: topics[2]._id,
        questionText: 'What does the "await" keyword do?',
        questionType: 'multiple-choice',
        options: [
            { text: 'Pauses execution until a Promise is resolved', isCorrect: true },
            { text: 'Creates a new Promise', isCorrect: false },
            { text: 'Handles Promise rejection', isCorrect: false },
            { text: 'Makes code run faster', isCorrect: false }
        ],
        correctAnswer: 'Pauses execution until a Promise is resolved',
        explanation: 'The await keyword pauses the execution of an async function until a Promise is resolved or rejected.',
        difficulty: 'medium',
        expectedTime: 50,
        hints: ['It works with Promises', 'It pauses execution'],
        tags: ['async', 'promises', 'await'],
        status: 'active'
    },
    {
        topicId: topics[3]._id,
        questionText: 'What does useState return?',
        questionType: 'multiple-choice',
        options: [
            { text: 'An array with state value and setter function', isCorrect: true },
            { text: 'Just the state value', isCorrect: false },
            { text: 'An object with state properties', isCorrect: false },
            { text: 'A function to update state', isCorrect: false }
        ],
        correctAnswer: 'An array with state value and setter function',
        explanation: 'useState returns an array with two elements: the current state value and a function to update it.',
        difficulty: 'easy',
        expectedTime: 35,
        hints: ['It returns two things', 'Think about array destructuring'],
        tags: ['react', 'hooks', 'useState'],
        status: 'active'
    },
    {
        topicId: topics[4]._id,
        questionText: 'When does useEffect run by default?',
        questionType: 'multiple-choice',
        options: [
            { text: 'After every render', isCorrect: true },
            { text: 'Only on component mount', isCorrect: false },
            { text: 'Only on component unmount', isCorrect: false },
            { text: 'Before every render', isCorrect: false }
        ],
        correctAnswer: 'After every render',
        explanation: 'By default, useEffect runs after every render (both mount and updates) unless you provide a dependency array.',
        difficulty: 'medium',
        expectedTime: 55,
        hints: ['Think about the default behavior', 'Consider the dependency array'],
        tags: ['react', 'hooks', 'useEffect'],
        status: 'active'
    },
    {
        topicId: topics[0]._id,
        questionText: 'What does reduce() method do?',
        questionType: 'multiple-choice',
        options: [
            { text: 'Reduces an array to a single value', isCorrect: true },
            { text: 'Reduces array length by half', isCorrect: false },
            { text: 'Removes duplicate elements', isCorrect: false },
            { text: 'Makes array smaller in memory', isCorrect: false }
        ],
        correctAnswer: 'Reduces an array to a single value',
        explanation: 'The reduce() method executes a reducer function on each element, resulting in a single output value.',
        difficulty: 'medium',
        expectedTime: 65,
        hints: ['Think about accumulation', 'Single output value'],
        tags: ['arrays', 'reduce'],
        status: 'active'
    },
    {
        topicId: topics[2]._id,
        questionText: 'How do you handle errors in async/await?',
        questionType: 'multiple-choice',
        options: [
            { text: 'Using try/catch blocks', isCorrect: true },
            { text: 'Using .then() and .catch()', isCorrect: false },
            { text: 'Using error callbacks', isCorrect: false },
            { text: 'Errors are handled automatically', isCorrect: false }
        ],
        correctAnswer: 'Using try/catch blocks',
        explanation: 'Errors in async/await are typically handled using try/catch blocks, similar to synchronous code.',
        difficulty: 'easy',
        expectedTime: 40,
        hints: ['Think about synchronous error handling', 'Wrap await calls'],
        tags: ['async', 'error-handling', 'try-catch'],
        status: 'active'
    },
    {
        topicId: topics[1]._id,
        questionText: 'Can arrow functions be used as constructors?',
        questionType: 'multiple-choice',
        options: [
            { text: 'No, they cannot be used with "new"', isCorrect: true },
            { text: 'Yes, they work the same as regular functions', isCorrect: false },
            { text: 'Yes, but only in strict mode', isCorrect: false },
            { text: 'Yes, but with ES6+ only', isCorrect: false }
        ],
        correctAnswer: 'No, they cannot be used with "new"',
        explanation: 'Arrow functions cannot be used as constructors and will throw an error if used with the "new" keyword.',
        difficulty: 'hard',
        expectedTime: 70,
        hints: ['Think about prototype', 'Consider the "new" keyword'],
        tags: ['functions', 'arrow-functions', 'constructors'],
        status: 'active'
    },
    {
        topicId: topics[3]._id,
        questionText: 'What happens if you call setState multiple times in a row?',
        questionType: 'multiple-choice',
        options: [
            { text: 'React batches the updates for better performance', isCorrect: true },
            { text: 'Each update happens immediately', isCorrect: false },
            { text: 'Only the last update is applied', isCorrect: false },
            { text: 'It causes an error', isCorrect: false }
        ],
        correctAnswer: 'React batches the updates for better performance',
        explanation: 'React batches multiple setState calls together for better performance, applying them all at once.',
        difficulty: 'hard',
        expectedTime: 75,
        hints: ['Think about React optimization', 'Consider performance'],
        tags: ['react', 'useState', 'batching'],
        status: 'active'
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Connect to database
        await connectDB();

        // Clear existing data
        console.log('🧹 Cleaning existing data...');
        await Topic.deleteMany({});
        await Question.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Create topics
        console.log('📚 Creating topics...');
        const topics = await Topic.insertMany(sampleTopics);
        console.log(`✅ Created ${topics.length} topics\n`);

        // Create questions
        console.log('❓ Creating questions...');
        const questions = getSampleQuestions(topics);
        const createdQuestions = await Question.insertMany(questions);
        console.log(`✅ Created ${createdQuestions.length} questions\n`);

        console.log('🎉 Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - Topics: ${topics.length}`);
        console.log(`   - Questions: ${createdQuestions.length}`);
        console.log('\n✨ You can now start using your Smart Learning Platform!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed
seedDatabase();

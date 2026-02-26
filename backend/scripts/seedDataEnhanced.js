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
        console.log('🌱 Starting ENHANCED database seeding with MASSIVE topics...\n');

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

        // ============================================
        // CREATE COMPREHENSIVE TOPICS
        // ============================================
        const topics = await Topic.insertMany([
            // ========== C PROGRAMMING ==========
            { subject: 'C', topic: 'Basics', subtopic: 'Syntax', concept: 'Variables & Data Types', description: 'Understanding C data types and variable declaration' },
            { subject: 'C', topic: 'Basics', subtopic: 'Operators', concept: 'Arithmetic Operators', description: 'Using arithmetic operators in C' },
            { subject: 'C', topic: 'Control Flow', subtopic: 'Conditionals', concept: 'If-Else Statements', description: 'Decision making with if-else' },
            { subject: 'C', topic: 'Control Flow', subtopic: 'Loops', concept: 'For Loop', description: 'Iterating with for loops' },
            { subject: 'C', topic: 'Functions', subtopic: 'Declaration', concept: 'Function Basics', description: 'Creating and calling functions' },
            { subject: 'C', topic: 'Pointers', subtopic: 'Basics', concept: 'Pointer Fundamentals', description: 'Understanding memory addresses' },
            { subject: 'C', topic: 'Arrays', subtopic: 'One-Dimensional', concept: 'Array Declaration', description: 'Working with arrays in C' },
            { subject: 'C', topic: 'Strings', subtopic: 'String Handling', concept: 'String Functions', description: 'Using string.h library' },

            // ========== C++ PROGRAMMING ==========
            { subject: 'C++', topic: 'OOP Basics', subtopic: 'Classes', concept: 'Class Definition', description: 'Creating classes in C++' },
            { subject: 'C++', topic: 'OOP Basics', subtopic: 'Objects', concept: 'Object Creation', description: 'Instantiating objects' },
            { subject: 'C++', topic: 'Inheritance', subtopic: 'Single Inheritance', concept: 'Base & Derived Classes', description: 'Implementing inheritance' },
            { subject: 'C++', topic: 'Polymorphism', subtopic: 'Virtual Functions', concept: 'Runtime Polymorphism', description: 'Using virtual functions' },
            { subject: 'C++', topic: 'STL', subtopic: 'Vectors', concept: 'Vector Operations', description: 'Using vector container' },
            { subject: 'C++', topic: 'STL', subtopic: 'Maps', concept: 'Map Container', description: 'Key-value storage with maps' },
            { subject: 'C++', topic: 'Templates', subtopic: 'Function Templates', concept: 'Generic Programming', description: 'Creating reusable code' },

            // ========== JAVA ==========
            { subject: 'Java', topic: 'Basics', subtopic: 'Syntax', concept: 'Data Types', description: 'Java primitive and reference types' },
            { subject: 'Java', topic: 'OOP', subtopic: 'Classes', concept: 'Class Structure', description: 'Java class anatomy' },
            { subject: 'Java', topic: 'OOP', subtopic: 'Inheritance', concept: 'extends Keyword', description: 'Inheriting from parent classes' },
            { subject: 'Java', topic: 'OOP', subtopic: 'Interfaces', concept: 'Interface Implementation', description: 'Using interfaces for abstraction' },
            { subject: 'Java', topic: 'Collections', subtopic: 'ArrayList', concept: 'Dynamic Arrays', description: 'Working with ArrayList' },
            { subject: 'Java', topic: 'Collections', subtopic: 'HashMap', concept: 'Hash-based Storage', description: 'Key-value pairs in Java' },
            { subject: 'Java', topic: 'Exception Handling', subtopic: 'Try-Catch', concept: 'Error Handling', description: 'Managing exceptions' },
            { subject: 'Java', topic: 'Multithreading', subtopic: 'Threads', concept: 'Thread Basics', description: 'Creating concurrent programs' },

            // ========== PYTHON ==========
            { subject: 'Python', topic: 'Basics', subtopic: 'Syntax', concept: 'Variables', description: 'Dynamic typing in Python' },
            { subject: 'Python', topic: 'Data Structures', subtopic: 'Lists', concept: 'List Operations', description: 'Working with Python lists' },
            { subject: 'Python', topic: 'Data Structures', subtopic: 'Dictionaries', concept: 'Dictionary Methods', description: 'Key-value storage' },
            { subject: 'Python', topic: 'Data Structures', subtopic: 'Tuples', concept: 'Immutable Sequences', description: 'Using tuples' },
            { subject: 'Python', topic: 'OOP', subtopic: 'Classes', concept: 'Class Definition', description: 'Python classes' },
            { subject: 'Python', topic: 'Functions', subtopic: 'Lambda', concept: 'Anonymous Functions', description: 'Using lambda expressions' },
            { subject: 'Python', topic: 'Functions', subtopic: 'Decorators', concept: 'Function Wrappers', description: 'Enhancing functions' },
            { subject: 'Python', topic: 'File I/O', subtopic: 'File Operations', concept: 'Reading Files', description: 'File handling in Python' },
            { subject: 'Python', topic: 'Libraries', subtopic: 'NumPy', concept: 'Array Operations', description: 'Numerical computing' },
            { subject: 'Python', topic: 'Libraries', subtopic: 'Pandas', concept: 'DataFrames', description: 'Data manipulation' },

            // ========== DSA (Data Structures & Algorithms) ==========
            { subject: 'DSA', topic: 'Arrays', subtopic: 'Operations', concept: 'Array Traversal', description: 'Iterating through arrays' },
            { subject: 'DSA', topic: 'Arrays', subtopic: 'Searching', concept: 'Binary Search', description: 'Efficient searching in sorted arrays' },
            { subject: 'DSA', topic: 'Linked Lists', subtopic: 'Singly Linked', concept: 'List Operations', description: 'Insert, delete, traverse' },
            { subject: 'DSA', topic: 'Stacks', subtopic: 'Stack Operations', concept: 'Push & Pop', description: 'LIFO data structure' },
            { subject: 'DSA', topic: 'Queues', subtopic: 'Queue Operations', concept: 'Enqueue & Dequeue', description: 'FIFO data structure' },
            { subject: 'DSA', topic: 'Trees', subtopic: 'Binary Trees', concept: 'Tree Traversal', description: 'Inorder, preorder, postorder' },
            { subject: 'DSA', topic: 'Trees', subtopic: 'BST', concept: 'Binary Search Tree', description: 'Ordered binary tree' },
            { subject: 'DSA', topic: 'Graphs', subtopic: 'Representation', concept: 'Adjacency List', description: 'Graph data structures' },
            { subject: 'DSA', topic: 'Sorting', subtopic: 'Comparison Sort', concept: 'Quick Sort', description: 'Divide and conquer sorting' },
            { subject: 'DSA', topic: 'Sorting', subtopic: 'Comparison Sort', concept: 'Merge Sort', description: 'Stable sorting algorithm' },
            { subject: 'DSA', topic: 'Dynamic Programming', subtopic: 'Memoization', concept: 'Top-Down DP', description: 'Caching subproblem results' },

            // ========== HTML ==========
            { subject: 'HTML', topic: 'Basics', subtopic: 'Elements', concept: 'HTML Tags', description: 'Understanding HTML elements' },
            { subject: 'HTML', topic: 'Basics', subtopic: 'Attributes', concept: 'Element Attributes', description: 'Adding properties to elements' },
            { subject: 'HTML', topic: 'Forms', subtopic: 'Input Elements', concept: 'Form Controls', description: 'Creating input fields' },
            { subject: 'HTML', topic: 'Semantic HTML', subtopic: 'Structure', concept: 'Semantic Tags', description: 'Using header, nav, section, etc.' },
            { subject: 'HTML', topic: 'Multimedia', subtopic: 'Images', concept: 'img Tag', description: 'Embedding images' },
            { subject: 'HTML', topic: 'Multimedia', subtopic: 'Video', concept: 'video Tag', description: 'Embedding videos' },

            // ========== CSS ==========
            { subject: 'CSS', topic: 'Basics', subtopic: 'Selectors', concept: 'Element Selectors', description: 'Targeting HTML elements' },
            { subject: 'CSS', topic: 'Basics', subtopic: 'Properties', concept: 'Color & Typography', description: 'Styling text' },
            { subject: 'CSS', topic: 'Box Model', subtopic: 'Layout', concept: 'Margin & Padding', description: 'Understanding spacing' },
            { subject: 'CSS', topic: 'Flexbox', subtopic: 'Flex Container', concept: 'Flex Layout', description: 'One-dimensional layouts' },
            { subject: 'CSS', topic: 'Grid', subtopic: 'Grid Container', concept: 'Grid Layout', description: 'Two-dimensional layouts' },
            { subject: 'CSS', topic: 'Responsive Design', subtopic: 'Media Queries', concept: 'Breakpoints', description: 'Adaptive layouts' },
            { subject: 'CSS', topic: 'Animations', subtopic: 'Transitions', concept: 'CSS Transitions', description: 'Smooth property changes' },
            { subject: 'CSS', topic: 'Animations', subtopic: 'Keyframes', concept: 'CSS Animations', description: 'Complex animations' },

            // ========== JAVASCRIPT ==========
            { subject: 'JavaScript', topic: 'Basics', subtopic: 'Variables', concept: 'let & const', description: 'Variable declaration' },
            { subject: 'JavaScript', topic: 'Basics', subtopic: 'Data Types', concept: 'Primitive Types', description: 'Understanding JS types' },
            { subject: 'JavaScript', topic: 'Functions', subtopic: 'Arrow Functions', concept: 'ES6 Syntax', description: 'Modern function syntax' },
            { subject: 'JavaScript', topic: 'Functions', subtopic: 'Closures', concept: 'Lexical Scope', description: 'Function closures' },
            { subject: 'JavaScript', topic: 'Async', subtopic: 'Promises', concept: 'Promise Basics', description: 'Async operations' },
            { subject: 'JavaScript', topic: 'Async', subtopic: 'Async/Await', concept: 'Async Functions', description: 'Cleaner async code' },
            { subject: 'JavaScript', topic: 'DOM', subtopic: 'Manipulation', concept: 'DOM Selection', description: 'Selecting elements' },
            { subject: 'JavaScript', topic: 'DOM', subtopic: 'Events', concept: 'Event Listeners', description: 'Handling user events' },
            { subject: 'JavaScript', topic: 'ES6+', subtopic: 'Destructuring', concept: 'Array & Object Destructuring', description: 'Unpacking values' },
            { subject: 'JavaScript', topic: 'ES6+', subtopic: 'Spread Operator', concept: 'Spread Syntax', description: 'Expanding iterables' },

            // ========== REACT JS ==========
            { subject: 'React', topic: 'Basics', subtopic: 'Components', concept: 'Functional Components', description: 'Creating React components' },
            { subject: 'React', topic: 'Basics', subtopic: 'JSX', concept: 'JSX Syntax', description: 'JavaScript XML' },
            { subject: 'React', topic: 'Hooks', subtopic: 'useState', concept: 'State Management', description: 'Managing component state' },
            { subject: 'React', topic: 'Hooks', subtopic: 'useEffect', concept: 'Side Effects', description: 'Lifecycle effects' },
            { subject: 'React', topic: 'Hooks', subtopic: 'useContext', concept: 'Context API', description: 'Global state' },
            { subject: 'React', topic: 'Hooks', subtopic: 'useRef', concept: 'References', description: 'DOM refs and mutable values' },
            { subject: 'React', topic: 'Routing', subtopic: 'React Router', concept: 'Route Configuration', description: 'Client-side routing' },
            { subject: 'React', topic: 'State Management', subtopic: 'Redux', concept: 'Store & Actions', description: 'Centralized state' },

            // ========== NODE.JS ==========
            { subject: 'Node.js', topic: 'Basics', subtopic: 'Modules', concept: 'require & module.exports', description: 'Module system' },
            { subject: 'Node.js', topic: 'Basics', subtopic: 'NPM', concept: 'Package Management', description: 'Using npm' },
            { subject: 'Node.js', topic: 'Express', subtopic: 'Routing', concept: 'Route Handlers', description: 'Creating API routes' },
            { subject: 'Node.js', topic: 'Express', subtopic: 'Middleware', concept: 'Custom Middleware', description: 'Request processing' },
            { subject: 'Node.js', topic: 'File System', subtopic: 'fs Module', concept: 'File Operations', description: 'Reading and writing files' },
            { subject: 'Node.js', topic: 'Async', subtopic: 'Event Loop', concept: 'Non-blocking I/O', description: 'Understanding async nature' },

            // ========== DBMS (Database Management Systems) ==========
            { subject: 'DBMS', topic: 'Basics', subtopic: 'Concepts', concept: 'Database Fundamentals', description: 'Understanding databases' },
            { subject: 'DBMS', topic: 'SQL', subtopic: 'Queries', concept: 'SELECT Statements', description: 'Retrieving data' },
            { subject: 'DBMS', topic: 'SQL', subtopic: 'Joins', concept: 'INNER JOIN', description: 'Combining tables' },
            { subject: 'DBMS', topic: 'SQL', subtopic: 'Joins', concept: 'LEFT JOIN', description: 'Left outer join' },
            { subject: 'DBMS', topic: 'Normalization', subtopic: 'Normal Forms', concept: '1NF, 2NF, 3NF', description: 'Database normalization' },
            { subject: 'DBMS', topic: 'Transactions', subtopic: 'ACID', concept: 'Transaction Properties', description: 'Atomicity, Consistency, Isolation, Durability' },
            { subject: 'DBMS', topic: 'Indexing', subtopic: 'Index Types', concept: 'B-Tree Indexes', description: 'Improving query performance' },

            // ========== MONGODB ==========
            { subject: 'MongoDB', topic: 'Basics', subtopic: 'Documents', concept: 'BSON Format', description: 'Understanding documents' },
            { subject: 'MongoDB', topic: 'CRUD', subtopic: 'Create', concept: 'insertOne & insertMany', description: 'Adding documents' },
            { subject: 'MongoDB', topic: 'CRUD', subtopic: 'Read', concept: 'find & findOne', description: 'Querying documents' },
            { subject: 'MongoDB', topic: 'CRUD', subtopic: 'Update', concept: 'updateOne & updateMany', description: 'Modifying documents' },
            { subject: 'MongoDB', topic: 'CRUD', subtopic: 'Delete', concept: 'deleteOne & deleteMany', description: 'Removing documents' },
            { subject: 'MongoDB', topic: 'Mongoose', subtopic: 'Schemas', concept: 'Schema Definition', description: 'Defining data models' },
            { subject: 'MongoDB', topic: 'Mongoose', subtopic: 'Models', concept: 'Model Creation', description: 'Working with models' },
            { subject: 'MongoDB', topic: 'Aggregation', subtopic: 'Pipeline', concept: 'Aggregation Stages', description: 'Complex queries' },

            // ========== PHP ==========
            { subject: 'PHP', topic: 'Basics', subtopic: 'Syntax', concept: 'Variables & Types', description: 'PHP fundamentals' },
            { subject: 'PHP', topic: 'Functions', subtopic: 'User Functions', concept: 'Function Declaration', description: 'Creating functions' },
            { subject: 'PHP', topic: 'OOP', subtopic: 'Classes', concept: 'Class Basics', description: 'Object-oriented PHP' },
            { subject: 'PHP', topic: 'Forms', subtopic: 'Form Handling', concept: '$_POST & $_GET', description: 'Processing form data' },
            { subject: 'PHP', topic: 'Database', subtopic: 'MySQL', concept: 'PDO & MySQLi', description: 'Database connectivity' },
            { subject: 'PHP', topic: 'Sessions', subtopic: 'Session Management', concept: '$_SESSION', description: 'User sessions' },

            // ========== ADDITIONAL SUBJECTS ==========
            // TypeScript
            { subject: 'TypeScript', topic: 'Basics', subtopic: 'Types', concept: 'Type Annotations', description: 'Static typing in JS' },
            { subject: 'TypeScript', topic: 'Interfaces', subtopic: 'Type Definitions', concept: 'Interface Declaration', description: 'Defining object shapes' },
            { subject: 'TypeScript', topic: 'Generics', subtopic: 'Generic Types', concept: 'Type Parameters', description: 'Reusable components' },

            // Vue.js
            { subject: 'Vue.js', topic: 'Basics', subtopic: 'Components', concept: 'Vue Components', description: 'Building Vue apps' },
            { subject: 'Vue.js', topic: 'Directives', subtopic: 'Built-in Directives', concept: 'v-if, v-for, v-bind', description: 'Template directives' },
            { subject: 'Vue.js', topic: 'Reactivity', subtopic: 'Data Binding', concept: 'Two-way Binding', description: 'v-model directive' },

            // Angular
            { subject: 'Angular', topic: 'Basics', subtopic: 'Components', concept: 'Component Architecture', description: 'Angular components' },
            { subject: 'Angular', topic: 'Services', subtopic: 'Dependency Injection', concept: 'Injectable Services', description: 'Service pattern' },
            { subject: 'Angular', topic: 'Routing', subtopic: 'Router Module', concept: 'Route Configuration', description: 'Navigation' },

            // Git & Version Control
            { subject: 'Git', topic: 'Basics', subtopic: 'Commands', concept: 'git init, add, commit', description: 'Basic Git workflow' },
            { subject: 'Git', topic: 'Branching', subtopic: 'Branch Management', concept: 'Creating Branches', description: 'Working with branches' },
            { subject: 'Git', topic: 'Collaboration', subtopic: 'Remote', concept: 'push & pull', description: 'Remote repositories' },

            // Docker
            { subject: 'Docker', topic: 'Basics', subtopic: 'Containers', concept: 'Container Fundamentals', description: 'Understanding containers' },
            { subject: 'Docker', topic: 'Images', subtopic: 'Dockerfile', concept: 'Building Images', description: 'Creating Docker images' },

            // AWS
            { subject: 'AWS', topic: 'EC2', subtopic: 'Compute', concept: 'Virtual Servers', description: 'Cloud computing' },
            { subject: 'AWS', topic: 'S3', subtopic: 'Storage', concept: 'Object Storage', description: 'Cloud storage' },

            // Linux
            { subject: 'Linux', topic: 'Commands', subtopic: 'File Operations', concept: 'ls, cd, pwd', description: 'Navigation commands' },
            { subject: 'Linux', topic: 'Permissions', subtopic: 'File Permissions', concept: 'chmod & chown', description: 'Access control' },

            // GraphQL
            { subject: 'GraphQL', topic: 'Basics', subtopic: 'Queries', concept: 'Query Syntax', description: 'Fetching data' },
            { subject: 'GraphQL', topic: 'Mutations', subtopic: 'Data Modification', concept: 'Mutation Syntax', description: 'Modifying data' },

            // REST API
            { subject: 'REST API', topic: 'Basics', subtopic: 'HTTP Methods', concept: 'GET, POST, PUT, DELETE', description: 'RESTful operations' },
            { subject: 'REST API', topic: 'Design', subtopic: 'Best Practices', concept: 'API Design Patterns', description: 'Designing REST APIs' },
        ]);

        console.log(`✓ Created ${topics.length} topics across multiple subjects!\n`);

        // ============================================
        // CREATE SAMPLE QUESTIONS (10 per major subject)
        // ============================================
        const questions = [
            // C Programming Questions
            {
                topicId: topics.find(t => t.subject === 'C' && t.concept === 'Variables & Data Types')?._id,
                questionText: 'Which is the correct syntax to declare an integer variable in C?',
                options: [
                    { text: 'int x;', isCorrect: true },
                    { text: 'integer x;', isCorrect: false },
                    { text: 'var x;', isCorrect: false },
                    { text: 'x: int;', isCorrect: false }
                ],
                correctAnswer: 'int x;',
                difficulty: 'easy',
                difficultyScore: 1,
                tags: ['c', 'variables', 'syntax'],
                expectedTime: 20,
                explanation: 'In C, integers are declared using the "int" keyword followed by the variable name.',
                hints: ['Look for the keyword "int"'],
                status: 'active',
                createdBy: adminUser._id
            },

            // C++ Programming Questions
            {
                topicId: topics.find(t => t.subject === 'C++' && t.concept === 'Class Definition')?._id,
                questionText: 'How do you define a class in C++?',
                options: [
                    { text: 'class MyClass {};', isCorrect: true },
                    { text: 'Class MyClass {};', isCorrect: false },
                    { text: 'define class MyClass {};', isCorrect: false },
                    { text: 'object MyClass {};', isCorrect: false }
                ],
                correctAnswer: 'class MyClass {};',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['cpp', 'oop', 'classes'],
                expectedTime: 30,
                explanation: 'Classes in C++ are defined using the "class" keyword (lowercase) followed by the class name.',
                hints: ['Use lowercase "class" keyword'],
                status: 'active',
                createdBy: adminUser._id
            },

            // Java Questions
            {
                topicId: topics.find(t => t.subject === 'Java' && t.concept === 'Data Types')?._id,
                questionText: 'What is the default value of a boolean variable in Java?',
                options: [
                    { text: 'false', isCorrect: true },
                    { text: 'true', isCorrect: false },
                    { text: 'null', isCorrect: false },
                    { text: '0', isCorrect: false }
                ],
                correctAnswer: 'false',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['java', 'data-types', 'boolean'],
                expectedTime: 25,
                explanation: 'In Java, boolean variables are initialized to false by default.',
                hints: ['Think about the absence of truth'],
                status: 'active',
                createdBy: adminUser._id
            },

            // Python Questions
            {
                topicId: topics.find(t => t.subject === 'Python' && t.concept === 'List Operations')?._id,
                questionText: 'How do you add an element to the end of a Python list?',
                options: [
                    { text: 'list.append(element)', isCorrect: true },
                    { text: 'list.add(element)', isCorrect: false },
                    { text: 'list.push(element)', isCorrect: false },
                    { text: 'list.insert(element)', isCorrect: false }
                ],
                correctAnswer: 'list.append(element)',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['python', 'lists', 'methods'],
                expectedTime: 25,
                explanation: 'The append() method adds an element to the end of a Python list.',
                hints: ['Similar to "append" in English'],
                status: 'active',
                createdBy: adminUser._id
            },

            // DSA Questions
            {
                topicId: topics.find(t => t.subject === 'DSA' && t.concept === 'Binary Search')?._id,
                questionText: 'What is the time complexity of binary search?',
                options: [
                    { text: 'O(log n)', isCorrect: true },
                    { text: 'O(n)', isCorrect: false },
                    { text: 'O(n log n)', isCorrect: false },
                    { text: 'O(1)', isCorrect: false }
                ],
                correctAnswer: 'O(log n)',
                difficulty: 'medium',
                difficultyScore: 5,
                tags: ['dsa', 'binary-search', 'complexity'],
                expectedTime: 40,
                explanation: 'Binary search divides the search space in half each iteration, resulting in logarithmic time complexity.',
                hints: ['Think about how many times you can divide n by 2'],
                status: 'active',
                createdBy: adminUser._id
            },

            // HTML Questions
            {
                topicId: topics.find(t => t.subject === 'HTML' && t.concept === 'HTML Tags')?._id,
                questionText: 'Which HTML tag is used for the largest heading?',
                options: [
                    { text: '<h1>', isCorrect: true },
                    { text: '<h6>', isCorrect: false },
                    { text: '<heading>', isCorrect: false },
                    { text: '<head>', isCorrect: false }
                ],
                correctAnswer: '<h1>',
                difficulty: 'easy',
                difficultyScore: 1,
                tags: ['html', 'headings', 'tags'],
                expectedTime: 20,
                explanation: 'The <h1> tag represents the largest and most important heading in HTML.',
                hints: ['Lower numbers mean bigger headings'],
                status: 'active',
                createdBy: adminUser._id
            },

            // CSS Questions
            {
                topicId: topics.find(t => t.subject === 'CSS' && t.concept === 'Flex Layout')?._id,
                questionText: 'Which property is used to make a container a flex container?',
                options: [
                    { text: 'display: flex;', isCorrect: true },
                    { text: 'flex: true;', isCorrect: false },
                    { text: 'layout: flex;', isCorrect: false },
                    { text: 'container: flex;', isCorrect: false }
                ],
                correctAnswer: 'display: flex;',
                difficulty: 'easy',
                difficultyScore: 3,
                tags: ['css', 'flexbox', 'layout'],
                expectedTime: 30,
                explanation: 'Setting display: flex on a container enables flexbox layout for its children.',
                hints: ['It\'s a display property'],
                status: 'active',
                createdBy: adminUser._id
            },

            // JavaScript Questions
            {
                topicId: topics.find(t => t.subject === 'JavaScript' && t.concept === 'let & const')?._id,
                questionText: 'What is the difference between let and const?',
                options: [
                    { text: 'const cannot be reassigned, let can', isCorrect: true },
                    { text: 'let is global, const is local', isCorrect: false },
                    { text: 'const is faster than let', isCorrect: false },
                    { text: 'There is no difference', isCorrect: false }
                ],
                correctAnswer: 'const cannot be reassigned, let can',
                difficulty: 'easy',
                difficultyScore: 3,
                tags: ['javascript', 'variables', 'es6'],
                expectedTime: 30,
                explanation: 'const creates a constant reference that cannot be reassigned, while let allows reassignment.',
                hints: ['Think about "constant" meaning'],
                status: 'active',
                createdBy: adminUser._id
            },

            // React Questions
            {
                topicId: topics.find(t => t.subject === 'React' && t.concept === 'State Management')?._id,
                questionText: 'What does useState return?',
                options: [
                    { text: 'An array with [state, setState]', isCorrect: true },
                    { text: 'An object with state and setState', isCorrect: false },
                    { text: 'Just the state value', isCorrect: false },
                    { text: 'A function to update state', isCorrect: false }
                ],
                correctAnswer: 'An array with [state, setState]',
                difficulty: 'easy',
                difficultyScore: 3,
                tags: ['react', 'hooks', 'state'],
                expectedTime: 35,
                explanation: 'useState returns an array with two elements: the current state value and a function to update it.',
                hints: ['Think about array destructuring'],
                status: 'active',
                createdBy: adminUser._id
            },

            // Node.js Questions
            {
                topicId: topics.find(t => t.subject === 'Node.js' && t.concept === 'require & module.exports')?._id,
                questionText: 'How do you export a function in Node.js?',
                options: [
                    { text: 'module.exports = myFunction;', isCorrect: true },
                    { text: 'export myFunction;', isCorrect: false },
                    { text: 'exports.default = myFunction;', isCorrect: false },
                    { text: 'return myFunction;', isCorrect: false }
                ],
                correctAnswer: 'module.exports = myFunction;',
                difficulty: 'easy',
                difficultyScore: 3,
                tags: ['nodejs', 'modules', 'exports'],
                expectedTime: 30,
                explanation: 'In Node.js, you use module.exports to export values from a module.',
                hints: ['Use the module object'],
                status: 'active',
                createdBy: adminUser._id
            },

            // DBMS Questions
            {
                topicId: topics.find(t => t.subject === 'DBMS' && t.concept === 'SELECT Statements')?._id,
                questionText: 'Which SQL statement is used to retrieve data from a database?',
                options: [
                    { text: 'SELECT', isCorrect: true },
                    { text: 'GET', isCorrect: false },
                    { text: 'RETRIEVE', isCorrect: false },
                    { text: 'FETCH', isCorrect: false }
                ],
                correctAnswer: 'SELECT',
                difficulty: 'easy',
                difficultyScore: 1,
                tags: ['dbms', 'sql', 'queries'],
                expectedTime: 20,
                explanation: 'The SELECT statement is the primary way to query and retrieve data from database tables.',
                hints: ['Think about "selecting" data'],
                status: 'active',
                createdBy: adminUser._id
            },

            // MongoDB Questions
            {
                topicId: topics.find(t => t.subject === 'MongoDB' && t.concept === 'find & findOne')?._id,
                questionText: 'What does findOne() return in MongoDB?',
                options: [
                    { text: 'A single document', isCorrect: true },
                    { text: 'An array of documents', isCorrect: false },
                    { text: 'A cursor', isCorrect: false },
                    { text: 'Boolean true/false', isCorrect: false }
                ],
                correctAnswer: 'A single document',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['mongodb', 'queries', 'find'],
                expectedTime: 25,
                explanation: 'findOne() returns the first document that matches the query criteria, or null if no match.',
                hints: ['The name says "one"'],
                status: 'active',
                createdBy: adminUser._id
            },

            // PHP Questions
            {
                topicId: topics.find(t => t.subject === 'PHP' && t.concept === 'Variables & Types')?._id,
                questionText: 'How do you start a variable name in PHP?',
                options: [
                    { text: '$', isCorrect: true },
                    { text: '#', isCorrect: false },
                    { text: '@', isCorrect: false },
                    { text: '&', isCorrect: false }
                ],
                correctAnswer: '$',
                difficulty: 'easy',
                difficultyScore: 1,
                tags: ['php', 'variables', 'syntax'],
                expectedTime: 20,
                explanation: 'In PHP, all variable names must start with the dollar sign ($).',
                hints: ['It\'s a common currency symbol'],
                status: 'active',
                createdBy: adminUser._id
            },

            // TypeScript Questions
            {
                topicId: topics.find(t => t.subject === 'TypeScript' && t.concept === 'Type Annotations')?._id,
                questionText: 'How do you annotate a variable type in TypeScript?',
                options: [
                    { text: 'let name: string;', isCorrect: true },
                    { text: 'let name as string;', isCorrect: false },
                    { text: 'let string name;', isCorrect: false },
                    { text: 'let name<string>;', isCorrect: false }
                ],
                correctAnswer: 'let name: string;',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['typescript', 'types', 'syntax'],
                expectedTime: 25,
                explanation: 'TypeScript uses colon syntax to annotate variable types.',
                hints: ['Use a colon after the variable name'],
                status: 'active',
                createdBy: adminUser._id
            },

            // Git Questions
            {
                topicId: topics.find(t => t.subject === 'Git' && t.concept === 'git init, add, commit')?._id,
                questionText: 'Which command initializes a new Git repository?',
                options: [
                    { text: 'git init', isCorrect: true },
                    { text: 'git start', isCorrect: false },
                    { text: 'git create', isCorrect: false },
                    { text: 'git new', isCorrect: false }
                ],
                correctAnswer: 'git init',
                difficulty: 'easy',
                difficultyScore: 1,
                tags: ['git', 'version-control', 'initialization'],
                expectedTime: 20,
                explanation: 'git init creates a new Git repository in the current directory.',
                hints: ['"init" is short for initialize'],
                status: 'active',
                createdBy: adminUser._id
            },
            // Continue questions array


            // ========== AWS QUESTIONS ==========
            {
                topicId: topics.find(t => t.subject === 'AWS' && t.concept === 'Virtual Servers')?._id,
                questionText: 'What is the primary function of AWS EC2?',
                options: [
                    { text: 'To provide resizable compute capacity in the cloud', isCorrect: true },
                    { text: 'To store objects', isCorrect: false },
                    { text: 'To manage relational databases', isCorrect: false },
                    { text: 'To deliver content globally', isCorrect: false }
                ],
                correctAnswer: 'To provide resizable compute capacity in the cloud',
                difficulty: 'easy',
                difficultyScore: 1,
                tags: ['aws', 'ec2', 'compute'],
                expectedTime: 30,
                explanation: 'Amazon Elastic Compute Cloud (Amazon EC2) provides scalable computing capacity in the AWS Cloud.',
                hints: ['Think "Elastic Compute"'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'AWS' && t.concept === 'Object Storage')?._id,
                questionText: 'Which AWS service is used for object storage?',
                options: [
                    { text: 'Amazon S3', isCorrect: true },
                    { text: 'Amazon RDS', isCorrect: false },
                    { text: 'AWS Lambda', isCorrect: false },
                    { text: 'Amazon EC2', isCorrect: false }
                ],
                correctAnswer: 'Amazon S3',
                difficulty: 'easy',
                difficultyScore: 1,
                tags: ['aws', 's3', 'storage'],
                expectedTime: 25,
                explanation: 'Amazon Simple Storage Service (Amazon S3) is an object storage service offering industry-leading scalability, data availability, security, and performance.',
                hints: ['Think "Simple Storage"'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'AWS' && t.concept === 'Object Storage')?._id,
                questionText: 'What does S3 stand for in AWS?',
                options: [
                    { text: 'Simple Storage Service', isCorrect: true },
                    { text: 'Scalable Storage System', isCorrect: false },
                    { text: 'Secure Storage Server', isCorrect: false },
                    { text: 'Super Speed Storage', isCorrect: false }
                ],
                correctAnswer: 'Simple Storage Service',
                difficulty: 'easy',
                difficultyScore: 1,
                tags: ['aws', 's3', 'acronym'],
                expectedTime: 20,
                explanation: 'S3 stands for Simple Storage Service.',
                hints: ['Three words starting with S'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'AWS' && t.concept === 'Virtual Servers')?._id,
                questionText: 'Which AWS service allows you to run code without provisioning or managing servers?',
                options: [
                    { text: 'AWS Lambda', isCorrect: true },
                    { text: 'Amazon EC2', isCorrect: false },
                    { text: 'Amazon LightSail', isCorrect: false },
                    { text: 'AWS Elastic Beanstalk', isCorrect: false }
                ],
                correctAnswer: 'AWS Lambda',
                difficulty: 'medium',
                difficultyScore: 3,
                tags: ['aws', 'lambda', 'serverless'],
                expectedTime: 35,
                explanation: 'AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers.',
                hints: ['Greek letter used in physics'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'AWS' && t.concept === 'Virtual Servers')?._id,
                questionText: 'What is an AMI in AWS?',
                options: [
                    { text: 'Amazon Machine Image', isCorrect: true },
                    { text: 'Amazon Main Interface', isCorrect: false },
                    { text: 'Advanced Machine Integration', isCorrect: false },
                    { text: 'Automated Management Interface', isCorrect: false }
                ],
                correctAnswer: 'Amazon Machine Image',
                difficulty: 'medium',
                difficultyScore: 2,
                tags: ['aws', 'ec2', 'ami'],
                expectedTime: 30,
                explanation: 'An Amazon Machine Image (AMI) provides the information required to launch an instance.',
                hints: ['Image of a Machine'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'AWS' && t.concept === 'Virtual Servers')?._id,
                questionText: 'Which service is used to manage relational databases in AWS?',
                options: [
                    { text: 'Amazon RDS', isCorrect: true },
                    { text: 'Amazon DynamoDB', isCorrect: false },
                    { text: 'Amazon Redshift', isCorrect: false },
                    { text: 'Amazon ElastiCache', isCorrect: false }
                ],
                correctAnswer: 'Amazon RDS',
                difficulty: 'medium',
                difficultyScore: 3,
                tags: ['aws', 'rds', 'database'],
                expectedTime: 30,
                explanation: 'Amazon Relational Database Service (Amazon RDS) makes it easy to set up, operate, and scale a relational database in the cloud.',
                hints: ['Relational Database Service'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'AWS' && t.concept === 'Object Storage')?._id,
                questionText: 'What is the purpose of AWS IAM?',
                options: [
                    { text: 'To manage access to AWS resources', isCorrect: true },
                    { text: 'To monitor network traffic', isCorrect: false },
                    { text: 'To deploy applications', isCorrect: false },
                    { text: 'To store encryption keys', isCorrect: false }
                ],
                correctAnswer: 'To manage access to AWS resources',
                difficulty: 'medium',
                difficultyScore: 3,
                tags: ['aws', 'iam', 'security'],
                expectedTime: 40,
                explanation: 'AWS Identity and Access Management (IAM) helps you securely control access to AWS resources.',
                hints: ['Identity and Access Management'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'AWS' && t.concept === 'Object Storage')?._id,
                questionText: 'Which AWS service is a content delivery network (CDN)?',
                options: [
                    { text: 'Amazon CloudFront', isCorrect: true },
                    { text: 'Amazon Route 53', isCorrect: false },
                    { text: 'Amazon VPC', isCorrect: false },
                    { text: 'AWS Direct Connect', isCorrect: false }
                ],
                correctAnswer: 'Amazon CloudFront',
                difficulty: 'medium',
                difficultyScore: 3,
                tags: ['aws', 'cloudfront', 'cdn'],
                expectedTime: 30,
                explanation: 'Amazon CloudFront is a fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally.',
                hints: ['Cloud... Front?'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'AWS' && t.concept === 'Virtual Servers')?._id,
                questionText: 'What is a scalable, NoSQL database service provided by AWS?',
                options: [
                    { text: 'Amazon DynamoDB', isCorrect: true },
                    { text: 'Amazon RDS', isCorrect: false },
                    { text: 'Amazon Aurora', isCorrect: false },
                    { text: 'Amazon Neptune', isCorrect: false }
                ],
                correctAnswer: 'Amazon DynamoDB',
                difficulty: 'medium',
                difficultyScore: 4,
                tags: ['aws', 'dynamodb', 'nosql'],
                expectedTime: 35,
                explanation: 'Amazon DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale.',
                hints: ['Dynamic Database'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'AWS' && t.concept === 'Virtual Servers')?._id,
                questionText: 'Which service allows you to launch resources in a logically isolated virtual network?',
                options: [
                    { text: 'Amazon VPC', isCorrect: true },
                    { text: 'AWS VPN', isCorrect: false },
                    { text: 'Amazon Connect', isCorrect: false },
                    { text: 'AWS Direct Connect', isCorrect: false }
                ],
                correctAnswer: 'Amazon VPC',
                difficulty: 'hard',
                difficultyScore: 5,
                tags: ['aws', 'vpc', 'networking'],
                expectedTime: 45,
                explanation: 'Amazon Virtual Private Cloud (Amazon VPC) lets you provision a logically isolated section of the AWS Cloud.',
                hints: ['Virtual Private Cloud'],
                status: 'active',
                createdBy: adminUser._id
            },

            // ========== ANGULAR QUESTIONS ==========
            {
                topicId: topics.find(t => t.subject === 'Angular' && t.concept === 'Component Architecture')?._id,
                questionText: 'Which decorator is used to define a component in Angular?',
                options: [
                    { text: '@Component', isCorrect: true },
                    { text: '@Directive', isCorrect: false },
                    { text: '@Injectable', isCorrect: false },
                    { text: '@Module', isCorrect: false }
                ],
                correctAnswer: '@Component',
                difficulty: 'easy',
                difficultyScore: 1,
                tags: ['angular', 'component', 'decorator'],
                expectedTime: 20,
                explanation: 'The @Component decorator marks a class as an Angular component and provides configuration metadata.',
                hints: ['@ followed by Component'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Angular' && t.concept === 'Component Architecture')?._id,
                questionText: 'What is the CLI command to generate a new Angular component?',
                options: [
                    { text: 'ng generate component', isCorrect: true },
                    { text: 'ng new component', isCorrect: false },
                    { text: 'ng create component', isCorrect: false },
                    { text: 'ng add component', isCorrect: false }
                ],
                correctAnswer: 'ng generate component',
                difficulty: 'easy',
                difficultyScore: 1,
                tags: ['angular', 'cli', 'commands'],
                expectedTime: 25,
                explanation: 'The command "ng generate component <name>" (or "ng g c <name>") is used to create a new component in Angular.',
                hints: ['ng g c'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Angular' && t.concept === 'Component Architecture')?._id,
                questionText: 'What is meant by Two-way data binding in Angular?',
                options: [
                    { text: 'Synchronization of data between model and view', isCorrect: true },
                    { text: 'Passing data from parent to child', isCorrect: false },
                    { text: 'Passing data from child to parent', isCorrect: false },
                    { text: 'Fetching data from server', isCorrect: false }
                ],
                correctAnswer: 'Synchronization of data between model and view',
                difficulty: 'medium',
                difficultyScore: 3,
                tags: ['angular', 'databinding', 'concepts'],
                expectedTime: 30,
                explanation: 'Two-way data binding (usually via [(ngModel)]) allows for immediate synchronization between the model and the view.',
                hints: ['View updates Model, Model updates View'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Angular' && t.concept === 'Component Architecture')?._id,
                questionText: 'Which directive is used for conditional rendering in Angular?',
                options: [
                    { text: '*ngIf', isCorrect: true },
                    { text: '*ngFor', isCorrect: false },
                    { text: '*ngSwitch', isCorrect: false },
                    { text: '*ngShow', isCorrect: false }
                ],
                correctAnswer: '*ngIf',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['angular', 'directives', 'templates'],
                expectedTime: 25,
                explanation: '*ngIf is a structural directive that conditionally includes a template based on the value of an expression.',
                hints: ['If condition'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Angular' && t.concept === 'Injectable Services')?._id,
                questionText: 'What is the purpose of NgModule?',
                options: [
                    { text: 'To organize code into cohesive blocks', isCorrect: true },
                    { text: 'To define routes', isCorrect: false },
                    { text: 'To create services', isCorrect: false },
                    { text: 'To style components', isCorrect: false }
                ],
                correctAnswer: 'To organize code into cohesive blocks',
                difficulty: 'medium',
                difficultyScore: 3,
                tags: ['angular', 'ngmodule', 'architecture'],
                expectedTime: 40,
                explanation: 'NgModules are containers for a cohesive block of code dedicated to an application domain, a workflow, or a closely related set of capabilities.',
                hints: ['Modules organize things'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Angular' && t.concept === 'Component Architecture')?._id,
                questionText: 'Which file contains the main application module?',
                options: [
                    { text: 'app.module.ts', isCorrect: true },
                    { text: 'main.ts', isCorrect: false },
                    { text: 'app.component.ts', isCorrect: false },
                    { text: 'index.html', isCorrect: false }
                ],
                correctAnswer: 'app.module.ts',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['angular', 'structure', 'files'],
                expectedTime: 20,
                explanation: 'By convention, the root module is defined in app.module.ts.',
                hints: ['The module file for the app'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Angular' && t.concept === 'Injectable Services')?._id,
                questionText: 'How do you inject a service into a component?',
                options: [
                    { text: 'Through the constructor', isCorrect: true },
                    { text: 'Using the @Inject annotation on a property', isCorrect: false },
                    { text: 'By importing it directly', isCorrect: false },
                    { text: 'By instantiating it with new', isCorrect: false }
                ],
                correctAnswer: 'Through the constructor',
                difficulty: 'medium',
                difficultyScore: 3,
                tags: ['angular', 'dependency-injection', 'services'],
                expectedTime: 35,
                explanation: 'Angular uses constructor injection. You specify the dependency as a parameter in the component\'s constructor.',
                hints: ['Constructor Injection'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Angular' && t.concept === 'Component Architecture')?._id,
                questionText: 'Which function is called when a component is initialized?',
                options: [
                    { text: 'ngOnInit', isCorrect: true },
                    { text: 'ngOnChanges', isCorrect: false },
                    { text: 'ngAfterViewInit', isCorrect: false },
                    { text: 'constructor', isCorrect: false }
                ],
                correctAnswer: 'ngOnInit',
                difficulty: 'medium',
                difficultyScore: 2,
                tags: ['angular', 'lifecycle', 'components'],
                expectedTime: 30,
                explanation: 'ngOnInit is a lifecycle hook called by Angular to indicate that Angular is done creating the component.',
                hints: ['On Initialization'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Angular' && t.concept === 'Injectable Services')?._id,
                questionText: 'What is RxJS used for in Angular?',
                options: [
                    { text: 'Handling asynchronous data streams', isCorrect: true },
                    { text: 'Routing', isCorrect: false },
                    { text: 'Templating', isCorrect: false },
                    { text: 'Build optimization', isCorrect: false }
                ],
                correctAnswer: 'Handling asynchronous data streams',
                difficulty: 'hard',
                difficultyScore: 5,
                tags: ['angular', 'rxjs', 'async'],
                expectedTime: 40,
                explanation: 'Angular uses RxJS (Reactive Extensions for JavaScript) for handling asynchronous operations and events using Observables.',
                hints: ['Reactive Extensions'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Angular' && t.concept === 'Component Architecture')?._id,
                questionText: 'How do you pass data from a parent component to a child component?',
                options: [
                    { text: 'Using @Input decorator', isCorrect: true },
                    { text: 'Using @Output decorator', isCorrect: false },
                    { text: 'Using Services', isCorrect: false },
                    { text: 'Using Events', isCorrect: false }
                ],
                correctAnswer: 'Using @Input decorator',
                difficulty: 'medium',
                difficultyScore: 3,
                tags: ['angular', 'component-interaction', 'input'],
                expectedTime: 35,
                explanation: 'The @Input decorator lets a parent component update data in the child component.',
                hints: ['Input to child'],
                status: 'active',
                createdBy: adminUser._id
            },

            // ========== VUE.JS QUESTIONS ==========
            {
                topicId: topics.find(t => t.subject === 'Vue.js' && t.concept === 'Two-way Binding')?._id,
                questionText: 'Which directive is used for two-way data binding in Vue.js?',
                options: [
                    { text: 'v-model', isCorrect: true },
                    { text: 'v-bind', isCorrect: false },
                    { text: 'v-on', isCorrect: false },
                    { text: 'v-if', isCorrect: false }
                ],
                correctAnswer: 'v-model',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['vue', 'directives', 'binding'],
                expectedTime: 25,
                explanation: 'The v-model directive creates two-way data binding on form input, textarea, and select elements.',
                hints: ['Model binding'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Vue.js' && t.concept === 'Built-in Directives')?._id,
                questionText: 'How do you bind an attribute to a dynamic value in Vue?',
                options: [
                    { text: 'v-bind or :', isCorrect: true },
                    { text: 'v-model', isCorrect: false },
                    { text: '{{ }}', isCorrect: false },
                    { text: 'v-on', isCorrect: false }
                ],
                correctAnswer: 'v-bind or :',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['vue', 'directives', 'syntax'],
                expectedTime: 25,
                explanation: 'You use v-bind (or the shorthand :) to bind an attribute to an expression.',
                hints: ['Bind attribute'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Vue.js' && t.concept === 'Vue Components')?._id,
                questionText: 'Which lifecycle hook is called after the instance has been mounted?',
                options: [
                    { text: 'mounted', isCorrect: true },
                    { text: 'created', isCorrect: false },
                    { text: 'updated', isCorrect: false },
                    { text: 'destroyed', isCorrect: false }
                ],
                correctAnswer: 'mounted',
                difficulty: 'medium',
                difficultyScore: 3,
                tags: ['vue', 'lifecycle', 'hooks'],
                expectedTime: 30,
                explanation: 'The mounted hook is called after the instance has been mounted to the DOM.',
                hints: ['After mounting'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Vue.js' && t.concept === 'Vue Components')?._id,
                questionText: 'What is the purpose of "computed" properties?',
                options: [
                    { text: 'To cache results based on dependencies', isCorrect: true },
                    { text: 'To perform side effects', isCorrect: false },
                    { text: 'To listen to events', isCorrect: false },
                    { text: 'To define methods', isCorrect: false }
                ],
                correctAnswer: 'To cache results based on dependencies',
                difficulty: 'medium',
                difficultyScore: 3,
                tags: ['vue', 'computed', 'reactivity'],
                expectedTime: 35,
                explanation: 'Computed properties are cached based on their reactive dependencies and only re-evaluate when those dependencies change.',
                hints: ['Computing values'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Vue.js' && t.concept === 'Built-in Directives')?._id,
                questionText: 'How can you listen to DOM events in Vue?',
                options: [
                    { text: 'v-on or @', isCorrect: true },
                    { text: 'v-bind', isCorrect: false },
                    { text: 'v-emit', isCorrect: false },
                    { text: 'v-listen', isCorrect: false }
                ],
                correctAnswer: 'v-on or @',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['vue', 'events', 'directives'],
                expectedTime: 25,
                explanation: 'The v-on directive (or shorthand @) is used to listen to DOM events.',
                hints: ['On event'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Vue.js' && t.concept === 'Vue Components')?._id,
                questionText: 'Which component is used for routing in Vue?',
                options: [
                    { text: '<router-view>', isCorrect: true },
                    { text: '<route-outlet>', isCorrect: false },
                    { text: '<vue-router>', isCorrect: false },
                    { text: '<app-router>', isCorrect: false }
                ],
                correctAnswer: '<router-view>',
                difficulty: 'medium',
                difficultyScore: 3,
                tags: ['vue', 'routing', 'components'],
                expectedTime: 30,
                explanation: 'The <router-view> component is a functional component that renders the matched component for the given route.',
                hints: ['View based on Router'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Vue.js' && t.concept === 'Vue Components')?._id,
                questionText: 'What is Vuex?',
                options: [
                    { text: 'A state management pattern and library', isCorrect: true },
                    { text: 'A routing library', isCorrect: false },
                    { text: 'A component library', isCorrect: false },
                    { text: 'A testing utility', isCorrect: false }
                ],
                correctAnswer: 'A state management pattern and library',
                difficulty: 'medium',
                difficultyScore: 4,
                tags: ['vue', 'vuex', 'state-management'],
                expectedTime: 35,
                explanation: 'Vuex is a state management pattern and library for Vue.js applications, serving as a centralized store.',
                hints: ['State management'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Vue.js' && t.concept === 'Built-in Directives')?._id,
                questionText: 'Which directive is used for list rendering?',
                options: [
                    { text: 'v-for', isCorrect: true },
                    { text: 'v-list', isCorrect: false },
                    { text: 'v-loop', isCorrect: false },
                    { text: 'v-repeat', isCorrect: false }
                ],
                correctAnswer: 'v-for',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['vue', 'directives', 'loops'],
                expectedTime: 25,
                explanation: 'The v-for directive is used to render a list of items based on an array.',
                hints: ['For loop'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Vue.js' && t.concept === 'Vue Components')?._id,
                questionText: 'What is a "prop" in Vue?',
                options: [
                    { text: 'Custom attribute to pass data to child components', isCorrect: true },
                    { text: 'Internal state of a component', isCorrect: false },
                    { text: 'CSS property', isCorrect: false },
                    { text: 'Global variable', isCorrect: false }
                ],
                correctAnswer: 'Custom attribute to pass data to child components',
                difficulty: 'medium',
                difficultyScore: 3,
                tags: ['vue', 'props', 'components'],
                expectedTime: 30,
                explanation: 'Props are custom attributes you can register on a component to pass data from a parent to a child.',
                hints: ['Properties passed down'],
                status: 'active',
                createdBy: adminUser._id
            },
            {
                topicId: topics.find(t => t.subject === 'Vue.js' && t.concept === 'Vue Components')?._id,
                questionText: 'How do you emit a custom event from a child component?',
                options: [
                    { text: 'this.$emit("event-name")', isCorrect: true },
                    { text: 'this.trigger("event-name")', isCorrect: false },
                    { text: 'this.dispatch("event-name")', isCorrect: false },
                    { text: 'this.send("event-name")', isCorrect: false }
                ],
                correctAnswer: 'this.$emit("event-name")',
                difficulty: 'medium',
                difficultyScore: 3,
                tags: ['vue', 'events', 'components'],
                expectedTime: 35,
                explanation: 'You can emit custom events from a component instance using the built-in $emit method.',
                hints: ['$emit'],
                status: 'active',
                createdBy: adminUser._id
            },

        ];

        // Filter out any questions with undefined topicId
        const validQuestions = questions.filter(q => q.topicId);

        await Question.insertMany(validQuestions);
        console.log(`✓ Created ${validQuestions.length} sample questions\n`);

        console.log('✅ ENHANCED Database seeding completed successfully!\n');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📚 SUBJECTS AVAILABLE:');
        console.log('───────────────────────────────────────────────────────────');
        const subjects = [...new Set(topics.map(t => t.subject))].sort();
        subjects.forEach(subject => {
            const count = topics.filter(t => t.subject === subject).length;
            console.log(`   ✓ ${subject} (${count} topics)`);
        });
        console.log('═══════════════════════════════════════════════════════════');
        console.log('LOGIN CREDENTIALS:');
        console.log('───────────────────────────────────────────────────────────');
        console.log('Admin:   admin@example.com / admin123');
        console.log('Student: student@example.com / student123');
        console.log('═══════════════════════════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();

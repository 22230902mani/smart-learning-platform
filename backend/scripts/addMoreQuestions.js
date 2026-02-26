require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-learning-platform')
    .then(() => console.log('✓ Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import models
const User = require('../models/User');
const Topic = require('../models/Topic');
const Question = require('../models/Question');

const addMoreQuestions = async () => {
    try {
        console.log('🌱 Adding MORE questions to the database...\n');

        // Get admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.error('❌ Admin user not found. Please run seedDataEnhanced.js first.');
            process.exit(1);
        }

        // Get all topics
        const topics = await Topic.find({});
        console.log(`Found ${topics.length} topics in database\n`);

        // Helper function to find topic
        const findTopic = (subject, conceptMatch) => {
            return topics.find(t => t.subject === subject && t.concept.includes(conceptMatch));
        };

        // ============================================
        // CREATE MORE QUESTIONS FOR EACH SUBJECT
        // ============================================
        const newQuestions = [
            // ========== MORE C QUESTIONS ==========
            {
                topicId: findTopic('C', 'Arithmetic Operators')?._id,
                questionText: 'What is the result of 10 % 3 in C?',
                options: [
                    { text: '1', isCorrect: true },
                    { text: '3', isCorrect: false },
                    { text: '0', isCorrect: false },
                    { text: '3.33', isCorrect: false }
                ],
                correctAnswer: '1',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['c', 'operators', 'modulo'],
                expectedTime: 25,
                explanation: 'The modulo operator % returns the remainder of division. 10 divided by 3 is 3 with remainder 1.',
                hints: ['Think about remainder'],
            },
            {
                topicId: findTopic('C', 'If-Else')?._id,
                questionText: 'Which operator is used for equality comparison in C?',
                options: [
                    { text: '==', isCorrect: true },
                    { text: '=', isCorrect: false },
                    { text: '===', isCorrect: false },
                    { text: 'equals', isCorrect: false }
                ],
                correctAnswer: '==',
                difficulty: 'easy',
                difficultyScore: 1,
                tags: ['c', 'operators', 'comparison'],
                expectedTime: 20,
                explanation: 'In C, == is used for comparison, while = is for assignment.',
                hints: ['Double equals'],
            },
            {
                topicId: findTopic('C', 'For Loop')?._id,
                questionText: 'What is the correct syntax for a for loop in C?',
                options: [
                    { text: 'for(int i=0; i<10; i++) {}', isCorrect: true },
                    { text: 'for i in range(10) {}', isCorrect: false },
                    { text: 'for(i=0 to 10) {}', isCorrect: false },
                    { text: 'loop(i=0; i<10) {}', isCorrect: false }
                ],
                correctAnswer: 'for(int i=0; i<10; i++) {}',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['c', 'loops', 'syntax'],
                expectedTime: 30,
                explanation: 'C for loops have three parts: initialization, condition, and increment, separated by semicolons.',
                hints: ['Three parts separated by semicolons'],
            },

            // ========== MORE C++ QUESTIONS ==========
            {
                topicId: findTopic('C++', 'Object Creation')?._id,
                questionText: 'How do you create an object of class MyClass in C++?',
                options: [
                    { text: 'MyClass obj;', isCorrect: true },
                    { text: 'new MyClass obj;', isCorrect: false },
                    { text: 'object MyClass obj;', isCorrect: false },
                    { text: 'create MyClass obj;', isCorrect: false }
                ],
                correctAnswer: 'MyClass obj;',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['cpp', 'oop', 'objects'],
                expectedTime: 25,
                explanation: 'Objects in C++ are created by declaring the class name followed by the object name.',
                hints: ['Class name then object name'],
            },
            {
                topicId: findTopic('C++', 'Vector Operations')?._id,
                questionText: 'Which header file is needed to use vectors in C++?',
                options: [
                    { text: '<vector>', isCorrect: true },
                    { text: '<array>', isCorrect: false },
                    { text: '<list>', isCorrect: false },
                    { text: '<collection>', isCorrect: false }
                ],
                correctAnswer: '<vector>',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['cpp', 'stl', 'vector'],
                expectedTime: 20,
                explanation: 'The <vector> header provides the vector container in C++ STL.',
                hints: ['Same name as the container'],
            },

            // ========== MORE JAVA QUESTIONS ==========
            {
                topicId: findTopic('Java', 'extends Keyword')?._id,
                questionText: 'Which keyword is used for inheritance in Java?',
                options: [
                    { text: 'extends', isCorrect: true },
                    { text: 'inherits', isCorrect: false },
                    { text: 'implements', isCorrect: false },
                    { text: 'derives', isCorrect: false }
                ],
                correctAnswer: 'extends',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['java', 'inheritance', 'oop'],
                expectedTime: 25,
                explanation: 'The extends keyword allows a class to inherit from another class in Java.',
                hints: ['Think about extending functionality'],
            },
            {
                topicId: findTopic('Java', 'Dynamic Arrays')?._id,
                questionText: 'How do you add an element to an ArrayList in Java?',
                options: [
                    { text: 'list.add(element)', isCorrect: true },
                    { text: 'list.push(element)', isCorrect: false },
                    { text: 'list.append(element)', isCorrect: false },
                    { text: 'list.insert(element)', isCorrect: false }
                ],
                correctAnswer: 'list.add(element)',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['java', 'collections', 'arraylist'],
                expectedTime: 25,
                explanation: 'The add() method appends elements to an ArrayList in Java.',
                hints: ['Simple verb for adding'],
            },

            // ========== MORE PYTHON QUESTIONS ==========
            {
                topicId: findTopic('Python', 'Dictionary Methods')?._id,
                questionText: 'How do you get all keys from a Python dictionary?',
                options: [
                    { text: 'dict.keys()', isCorrect: true },
                    { text: 'dict.getKeys()', isCorrect: false },
                    { text: 'dict.allKeys()', isCorrect: false },
                    { text: 'keys(dict)', isCorrect: false }
                ],
                correctAnswer: 'dict.keys()',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['python', 'dictionaries', 'methods'],
                expectedTime: 25,
                explanation: 'The keys() method returns all keys in a dictionary.',
                hints: ['Method named after what it returns'],
            },
            {
                topicId: findTopic('Python', 'Anonymous Functions')?._id,
                questionText: 'What is a lambda function in Python?',
                options: [
                    { text: 'An anonymous function', isCorrect: true },
                    { text: 'A recursive function', isCorrect: false },
                    { text: 'A class method', isCorrect: false },
                    { text: 'A built-in function', isCorrect: false }
                ],
                correctAnswer: 'An anonymous function',
                difficulty: 'medium',
                difficultyScore: 4,
                tags: ['python', 'lambda', 'functions'],
                expectedTime: 35,
                explanation: 'Lambda functions are small anonymous functions defined with the lambda keyword.',
                hints: ['Functions without names'],
            },

            // ========== MORE DSA QUESTIONS ==========
            {
                topicId: findTopic('DSA', 'Push & Pop')?._id,
                questionText: 'What data structure principle does a stack follow?',
                options: [
                    { text: 'LIFO (Last In First Out)', isCorrect: true },
                    { text: 'FIFO (First In First Out)', isCorrect: false },
                    { text: 'LILO (Last In Last Out)', isCorrect: false },
                    { text: 'Random Access', isCorrect: false }
                ],
                correctAnswer: 'LIFO (Last In First Out)',
                difficulty: 'easy',
                difficultyScore: 3,
                tags: ['dsa', 'stack', 'data-structures'],
                expectedTime: 30,
                explanation: 'Stacks follow LIFO - the last element added is the first one removed.',
                hints: ['Like a stack of plates'],
            },
            {
                topicId: findTopic('DSA', 'Enqueue & Dequeue')?._id,
                questionText: 'What principle does a queue follow?',
                options: [
                    { text: 'FIFO (First In First Out)', isCorrect: true },
                    { text: 'LIFO (Last In First Out)', isCorrect: false },
                    { text: 'Random Access', isCorrect: false },
                    { text: 'Priority Based', isCorrect: false }
                ],
                correctAnswer: 'FIFO (First In First Out)',
                difficulty: 'easy',
                difficultyScore: 3,
                tags: ['dsa', 'queue', 'data-structures'],
                expectedTime: 30,
                explanation: 'Queues follow FIFO - elements are processed in the order they were added.',
                hints: ['Like waiting in line'],
            },
            {
                topicId: findTopic('DSA', 'Quick Sort')?._id,
                questionText: 'What is the average time complexity of Quick Sort?',
                options: [
                    { text: 'O(n log n)', isCorrect: true },
                    { text: 'O(n²)', isCorrect: false },
                    { text: 'O(n)', isCorrect: false },
                    { text: 'O(log n)', isCorrect: false }
                ],
                correctAnswer: 'O(n log n)',
                difficulty: 'medium',
                difficultyScore: 5,
                tags: ['dsa', 'sorting', 'complexity'],
                expectedTime: 40,
                explanation: 'Quick Sort has an average time complexity of O(n log n) due to its divide-and-conquer approach.',
                hints: ['Efficient sorting algorithms are usually n log n'],
            },

            // ========== MORE HTML QUESTIONS ==========
            {
                topicId: findTopic('HTML', 'Form Controls')?._id,
                questionText: 'Which HTML tag creates a text input field?',
                options: [
                    { text: '<input type="text">', isCorrect: true },
                    { text: '<textfield>', isCorrect: false },
                    { text: '<text>', isCorrect: false },
                    { text: '<field type="text">', isCorrect: false }
                ],
                correctAnswer: '<input type="text">',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['html', 'forms', 'input'],
                expectedTime: 25,
                explanation: 'The input tag with type="text" creates a single-line text input field.',
                hints: ['Uses the input tag'],
            },
            {
                topicId: findTopic('HTML', 'img Tag')?._id,
                questionText: 'Which attribute is required for the img tag?',
                options: [
                    { text: 'src', isCorrect: true },
                    { text: 'href', isCorrect: false },
                    { text: 'link', isCorrect: false },
                    { text: 'url', isCorrect: false }
                ],
                correctAnswer: 'src',
                difficulty: 'easy',
                difficultyScore: 1,
                tags: ['html', 'images', 'attributes'],
                expectedTime: 20,
                explanation: 'The src (source) attribute specifies the path to the image file.',
                hints: ['Short for "source"'],
            },

            // ========== MORE CSS QUESTIONS ==========
            {
                topicId: findTopic('CSS', 'Margin & Padding')?._id,
                questionText: 'What is the difference between margin and padding?',
                options: [
                    { text: 'Margin is outside the border, padding inside', isCorrect: true },
                    { text: 'Padding is outside the border, margin inside', isCorrect: false },
                    { text: 'They are the same', isCorrect: false },
                    { text: 'Margin is for text, padding for elements', isCorrect: false }
                ],
                correctAnswer: 'Margin is outside the border, padding inside',
                difficulty: 'easy',
                difficultyScore: 3,
                tags: ['css', 'box-model', 'spacing'],
                expectedTime: 30,
                explanation: 'Margin creates space outside an element\'s border, while padding creates space inside.',
                hints: ['Think about the box model'],
            },
            {
                topicId: findTopic('CSS', 'Breakpoints')?._id,
                questionText: 'What CSS feature is used for responsive design?',
                options: [
                    { text: '@media queries', isCorrect: true },
                    { text: '@responsive', isCorrect: false },
                    { text: '@breakpoint', isCorrect: false },
                    { text: '@device', isCorrect: false }
                ],
                correctAnswer: '@media queries',
                difficulty: 'easy',
                difficultyScore: 3,
                tags: ['css', 'responsive', 'media-queries'],
                expectedTime: 30,
                explanation: 'Media queries allow you to apply different styles based on device characteristics.',
                hints: ['Starts with @media'],
            },

            // ========== MORE JAVASCRIPT QUESTIONS ==========
            {
                topicId: findTopic('JavaScript', 'Primitive Types')?._id,
                questionText: 'Which of these is NOT a primitive type in JavaScript?',
                options: [
                    { text: 'object', isCorrect: true },
                    { text: 'string', isCorrect: false },
                    { text: 'number', isCorrect: false },
                    { text: 'boolean', isCorrect: false }
                ],
                correctAnswer: 'object',
                difficulty: 'medium',
                difficultyScore: 4,
                tags: ['javascript', 'types', 'primitives'],
                expectedTime: 35,
                explanation: 'Objects are reference types, not primitive types. Primitives include string, number, boolean, null, undefined, symbol, and bigint.',
                hints: ['Think complex vs simple types'],
            },
            {
                topicId: findTopic('JavaScript', 'DOM Selection')?._id,
                questionText: 'Which method selects an element by ID?',
                options: [
                    { text: 'document.getElementById()', isCorrect: true },
                    { text: 'document.getElement()', isCorrect: false },
                    { text: 'document.selectById()', isCorrect: false },
                    { text: 'document.findById()', isCorrect: false }
                ],
                correctAnswer: 'document.getElementById()',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['javascript', 'dom', 'selection'],
                expectedTime: 25,
                explanation: 'getElementById() is the method to select an element by its ID attribute.',
                hints: ['Look for "ById" in the name'],
            },
            {
                topicId: findTopic('JavaScript', 'Event Listeners')?._id,
                questionText: 'How do you add a click event listener to an element?',
                options: [
                    { text: 'element.addEventListener("click", function)', isCorrect: true },
                    { text: 'element.onClick(function)', isCorrect: false },
                    { text: 'element.addEvent("click", function)', isCorrect: false },
                    { text: 'element.listen("click", function)', isCorrect: false }
                ],
                correctAnswer: 'element.addEventListener("click", function)',
                difficulty: 'easy',
                difficultyScore: 3,
                tags: ['javascript', 'events', 'dom'],
                expectedTime: 30,
                explanation: 'addEventListener() is the modern way to attach event handlers to elements.',
                hints: ['Method to add event listeners'],
            },

            // ========== MORE REACT QUESTIONS ==========
            {
                topicId: findTopic('React', 'JSX Syntax')?._id,
                questionText: 'What does JSX stand for?',
                options: [
                    { text: 'JavaScript XML', isCorrect: true },
                    { text: 'JavaScript Extension', isCorrect: false },
                    { text: 'Java Syntax Extension', isCorrect: false },
                    { text: 'JavaScript Extra', isCorrect: false }
                ],
                correctAnswer: 'JavaScript XML',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['react', 'jsx', 'syntax'],
                expectedTime: 25,
                explanation: 'JSX stands for JavaScript XML and allows writing HTML-like syntax in JavaScript.',
                hints: ['Think HTML is based on XML'],
            },
            {
                topicId: findTopic('React', 'Side Effects')?._id,
                questionText: 'What is the dependency array in useEffect used for?',
                options: [
                    { text: 'Control when the effect runs', isCorrect: true },
                    { text: 'Store effect results', isCorrect: false },
                    { text: 'Pass props to effect', isCorrect: false },
                    { text: 'Define effect priority', isCorrect: false }
                ],
                correctAnswer: 'Control when the effect runs',
                difficulty: 'medium',
                difficultyScore: 5,
                tags: ['react', 'hooks', 'useeffect'],
                expectedTime: 40,
                explanation: 'The dependency array determines when useEffect re-runs - it runs when dependencies change.',
                hints: ['Think about when effects should re-execute'],
            },

            // ========== MORE NODE.JS QUESTIONS ==========
            {
                topicId: findTopic('Node.js', 'Package Management')?._id,
                questionText: 'What command installs a package and saves it to package.json?',
                options: [
                    { text: 'npm install package-name', isCorrect: true },
                    { text: 'npm get package-name', isCorrect: false },
                    { text: 'npm add package-name', isCorrect: false },
                    { text: 'npm download package-name', isCorrect: false }
                ],
                correctAnswer: 'npm install package-name',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['nodejs', 'npm', 'packages'],
                expectedTime: 25,
                explanation: 'npm install automatically saves dependencies to package.json in newer npm versions.',
                hints: ['Standard install command'],
            },

            // ========== MORE DATABASE QUESTIONS ==========
            {
                topicId: findTopic('DBMS', 'INNER JOIN')?._id,
                questionText: 'What does INNER JOIN return?',
                options: [
                    { text: 'Only matching rows from both tables', isCorrect: true },
                    { text: 'All rows from both tables', isCorrect: false },
                    { text: 'Only rows from left table', isCorrect: false },
                    { text: 'Only rows from right table', isCorrect: false }
                ],
                correctAnswer: 'Only matching rows from both tables',
                difficulty: 'medium',
                difficultyScore: 5,
                tags: ['dbms', 'sql', 'joins'],
                expectedTime: 40,
                explanation: 'INNER JOIN returns only the rows where there is a match in both tables.',
                hints: ['Think "inner" means only the intersection'],
            },
            {
                topicId: findTopic('MongoDB', 'insertOne & insertMany')?._id,
                questionText: 'Which method inserts multiple documents in MongoDB?',
                options: [
                    { text: 'insertMany()', isCorrect: true },
                    { text: 'insertAll()', isCorrect: false },
                    { text: 'insert()', isCorrect: false },
                    { text: 'addMany()', isCorrect: false }
                ],
                correctAnswer: 'insertMany()',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['mongodb', 'crud', 'insert'],
                expectedTime: 25,
                explanation: 'insertMany() allows inserting multiple documents in a single operation.',
                hints: ['Name suggests "many" documents'],
            },

            // ========== MORE PHP QUESTIONS ==========
            {
                topicId: findTopic('PHP', '$_POST & $_GET')?._id,
                questionText: 'What is the difference between $_GET and $_POST?',
                options: [
                    { text: '$_GET shows data in URL, $_POST hides it', isCorrect: true },
                    { text: '$_GET is faster than $_POST', isCorrect: false },
                    { text: '$_POST is for reading, $_GET for writing', isCorrect: false },
                    { text: 'They are identical', isCorrect: false }
                ],
                correctAnswer: '$_GET shows data in URL, $_POST hides it',
                difficulty: 'medium',
                difficultyScore: 4,
                tags: ['php', 'forms', 'http'],
                expectedTime: 35,
                explanation: '$_GET appends data to URL (visible), while $_POST sends data in request body (hidden).',
                hints: ['Think about URL visibility'],
            },

            // ========== TYPESCRIPT QUESTIONS ==========
            {
                topicId: findTopic('TypeScript', 'Interface Declaration')?._id,
                questionText: 'How do you define an interface in TypeScript?',
                options: [
                    { text: 'interface MyInterface {}', isCorrect: true },
                    { text: 'type MyInterface = {}', isCorrect: false },
                    { text: 'class MyInterface {}', isCorrect: false },
                    { text: 'define interface MyInterface {}', isCorrect: false }
                ],
                correctAnswer: 'interface MyInterface {}',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['typescript', 'interface', 'types'],
                expectedTime: 25,
                explanation: 'Interfaces are defined using the interface keyword in TypeScript.',
                hints: ['Use the interface keyword'],
            },

            // ========== GIT QUESTIONS ==========
            {
                topicId: findTopic('Git', 'Creating Branches')?._id,
                questionText: 'Which command creates a new branch in Git?',
                options: [
                    { text: 'git branch branch-name', isCorrect: true },
                    { text: 'git create branch-name', isCorrect: false },
                    { text: 'git new branch-name', isCorrect: false },
                    { text: 'git add branch-name', isCorrect: false }
                ],
                correctAnswer: 'git branch branch-name',
                difficulty: 'easy',
                difficultyScore: 2,
                tags: ['git', 'branches', 'version-control'],
                expectedTime: 25,
                explanation: 'git branch followed by a name creates a new branch.',
                hints: ['Use the branch command'],
            },

            // ========== REST API QUESTIONS ==========
            {
                topicId: findTopic('REST API', 'GET, POST, PUT, DELETE')?._id,
                questionText: 'Which HTTP method is used to retrieve data?',
                options: [
                    { text: 'GET', isCorrect: true },
                    { text: 'POST', isCorrect: false },
                    { text: 'PUT', isCorrect: false },
                    { text: 'DELETE', isCorrect: false }
                ],
                correctAnswer: 'GET',
                difficulty: 'easy',
                difficultyScore: 1,
                tags: ['rest', 'http', 'methods'],
                expectedTime: 20,
                explanation: 'GET is the HTTP method for retrieving/reading data from a server.',
                hints: ['Think about "getting" data'],
            },
        ];

        // Filter out questions with undefined topicId and add common fields
        const validQuestions = newQuestions
            .filter(q => q.topicId)
            .map(q => ({
                ...q,
                status: 'active',
                createdBy: adminUser._id
            }));

        if (validQuestions.length > 0) {
            await Question.insertMany(validQuestions);
            console.log(`✅ Successfully added ${validQuestions.length} new questions!\n`);
        } else {
            console.log('⚠️  No valid questions to add. Make sure topics exist.\n');
        }

        // Show summary
        const totalQuestions = await Question.countDocuments();
        const questionsBySubject = await Question.aggregate([
            {
                $lookup: {
                    from: 'topics',
                    localField: 'topicId',
                    foreignField: '_id',
                    as: 'topic'
                }
            },
            { $unwind: '$topic' },
            {
                $group: {
                    _id: '$topic.subject',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        console.log('═══════════════════════════════════════════════════════════');
        console.log('📊 QUESTION BANK SUMMARY:');
        console.log('───────────────────────────────────────────────────────────');
        console.log(`Total Questions: ${totalQuestions}`);
        console.log('Questions by Subject:');
        questionsBySubject.forEach(({ _id, count }) => {
            console.log(`   • ${_id}: ${count} questions`);
        });
        console.log('═══════════════════════════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding questions:', error);
        process.exit(1);
    }
};

addMoreQuestions();

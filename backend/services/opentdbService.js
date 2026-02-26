const axios = require('axios');

// ============================================
// DUAL API SERVICE
// 1. QuizAPI.io - For programming/tech questions (free API key)
// 2. OpenTDB   - For general knowledge (no key needed)
// ============================================

const QUIZAPI_BASE_URL = 'https://quizapi.io/api/v1/questions';
const QUIZAPI_KEY = 'YOUR_API_KEY'; // Will be replaced from env

const OPENTDB_BASE_URL = 'https://opentdb.com/api.php';

// ============================================
// SUBJECT MAPPING
// ============================================

// Subjects that should use QuizAPI.io (programming/tech)
const QUIZAPI_SUBJECT_MAP = {
    'C': { category: 'code', tags: 'c' },
    'C++': { category: 'code', tags: 'c++,cpp' },
    'Java': { category: 'code', tags: 'Java' },
    'Python': { category: 'code', tags: 'Python' },
    'JavaScript': { category: 'code', tags: 'JavaScript' },
    'React': { category: 'code', tags: 'React' },
    'Node.js': { category: 'code', tags: 'NodeJS' },
    'HTML': { category: 'code', tags: 'HTML' },
    'CSS': { category: 'code', tags: 'HTML' },
    'MongoDB': { category: 'code', tags: 'MySQL' },
    'SQL': { category: 'sql', tags: 'MySQL,SQL' },
    'Angular': { category: 'code', tags: 'JavaScript' },
    'Vue.js': { category: 'code', tags: 'VueJS' },
    'PHP': { category: 'code', tags: 'PHP' },
    'Go': { category: 'code', tags: 'code' },
    'Ruby': { category: 'code', tags: 'code' },
    'Swift': { category: 'code', tags: 'code' },
    'Kotlin': { category: 'code', tags: 'code' },
    'R': { category: 'code', tags: 'code' },
    'DSA': { category: 'code', tags: 'code' },
    'Machine Learning': { category: 'code', tags: 'Python' },
    'Data Science': { category: 'code', tags: 'Python' },
    'AI Fundamentals': { category: 'code', tags: 'Python' },
    'Cyber Security': { category: 'code', tags: 'MySQL,Linux' },
    'Data Privacy & Ethics': { category: 'code', tags: 'Linux' },
    'Docker': { category: 'devops', tags: 'Docker' },
    'Linux': { category: 'linux', tags: 'Linux' },
    'DevOps': { category: 'devops', tags: 'DevOps' },
    'Kubernetes': { category: 'devops', tags: 'Kubernetes' },
    'Cloud Computing': { category: 'code', tags: 'Cloud' },
    'MERN Stack': { category: 'code', tags: 'React,JavaScript' }
};

// Subjects that should use OpenTDB (general knowledge)
const OPENTDB_SUBJECT_MAP = {
    'General Knowledge': 9,
    'Science': 17,
    'Mathematics': 19,
    'History': 23,
    'Geography': 22,
    'Sports': 21,
    'Art': 25,
    'Music': 12,
    'Film': 11,
    'Animals': 27,
    'Computers': 18,
    'Cyber Security': 18,
    'AI Fundamentals': 18,
    'Data Privacy & Ethics': 18,
    'Cloud Computing': 18,
    'DevOps': 18,
    'MERN Stack': 18
};

// Map difficulty levels
const DIFFICULTY_MAP = {
    'easy': 'easy',
    'medium': 'medium',
    'hard': 'hard',
    'Easy': 'easy',
    'Medium': 'medium',
    'Hard': 'hard'
};

// ============================================
// HTML ENTITY DECODER
// ============================================
function decodeHTMLEntities(text) {
    if (!text) return '';
    const entities = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
    };

    let decoded = text;
    for (const [entity, char] of Object.entries(entities)) {
        decoded = decoded.replace(new RegExp(entity, 'g'), char);
    }
    decoded = decoded.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
    decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
    return decoded;
}

// ============================================
// SHUFFLE ARRAY (Fisher-Yates)
// ============================================
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ============================================
// QUIZAPI.IO - Programming Questions
// ============================================
async function fetchFromQuizAPI(count, subject, difficulty) {
    const apiKey = process.env.QUIZAPI_KEY || QUIZAPI_KEY;

    if (!apiKey || apiKey === 'YOUR_API_KEY') {
        console.warn('[QuizAPI] No API key configured. Set QUIZAPI_KEY in your .env file.');
        console.warn('[QuizAPI] Get a free key at: https://quizapi.io/register');
        return [];
    }

    try {
        const subjectConfig = QUIZAPI_SUBJECT_MAP[subject] || { category: 'code', tags: 'code' };

        const params = {
            apiKey: apiKey,
            limit: Math.min(count, 20), // QuizAPI max per request is 20
            category: subjectConfig.category,
            tags: subjectConfig.tags
        };

        if (difficulty && DIFFICULTY_MAP[difficulty]) {
            params.difficulty = DIFFICULTY_MAP[difficulty];
        }

        console.log(`[QuizAPI] Fetching ${params.limit} "${subject}" questions...`, { category: params.category, tags: params.tags });

        const response = await axios.get(QUIZAPI_BASE_URL, { params, timeout: 10000 });

        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
            console.warn('[QuizAPI] No questions returned, trying without tags...');
            // Retry without specific tags
            delete params.tags;
            const retryResponse = await axios.get(QUIZAPI_BASE_URL, { params, timeout: 10000 });
            if (!retryResponse.data || !Array.isArray(retryResponse.data) || retryResponse.data.length === 0) {
                return [];
            }
            response.data = retryResponse.data;
        }

        // Transform QuizAPI format to your app's format
        const questions = response.data
            .filter(q => q.multiple_correct_answers === 'false') // Only single-answer MCQs
            .map(q => {
                // Extract answers that are not null
                const answerKeys = ['answer_a', 'answer_b', 'answer_c', 'answer_d', 'answer_e', 'answer_f'];
                const correctKeys = ['answer_a_correct', 'answer_b_correct', 'answer_c_correct', 'answer_d_correct', 'answer_e_correct', 'answer_f_correct'];

                const options = [];
                let correctAnswer = '';

                answerKeys.forEach((key, idx) => {
                    if (q.answers[key]) {
                        const isCorrect = q.correct_answers[correctKeys[idx]] === 'true';
                        options.push({
                            text: q.answers[key],
                            isCorrect: isCorrect
                        });
                        if (isCorrect) {
                            correctAnswer = q.answers[key];
                        }
                    }
                });

                // Skip if no correct answer found or less than 2 options
                if (!correctAnswer || options.length < 2) return null;

                // Ensure we have exactly 4 options (pad if needed)
                while (options.length < 4) {
                    options.push({ text: 'None of the above', isCorrect: false });
                }

                const diff = DIFFICULTY_MAP[q.difficulty] || 'medium';

                return {
                    questionText: decodeHTMLEntities(q.question),
                    questionType: 'multiple-choice',
                    options: shuffleArray(options.slice(0, 4)),
                    correctAnswer: correctAnswer,
                    difficulty: diff,
                    difficultyScore: diff === 'easy' ? 3 : diff === 'medium' ? 5 : 8,
                    expectedTime: diff === 'easy' ? 30 : diff === 'medium' ? 60 : 90,
                    tags: (q.tags || []).map(t => t.name),
                    explanation: q.explanation || `Category: ${q.category || subject}`,
                    hints: [q.tip || `This is a ${diff} level ${subject} question`],
                    status: 'active',
                    source: 'opentdb',
                    statistics: {
                        totalAttempts: 0,
                        correctAttempts: 0,
                        averageTime: 0
                    }
                };
            })
            .filter(q => q !== null); // Remove any null entries

        console.log(`[QuizAPI] Successfully fetched ${questions.length} ${subject} questions`);
        return questions;

    } catch (error) {
        console.error('[QuizAPI] Error:', error.response?.status, error.message);
        if (error.response?.status === 401) {
            console.error('[QuizAPI] Invalid API key. Get a free key at: https://quizapi.io/register');
        }
        return [];
    }
}

// ============================================
// OPENTDB - General Knowledge Questions
// ============================================
async function fetchFromOpenTDB(count, subject, difficulty) {
    try {
        const params = {
            amount: Math.min(count, 50),
            type: 'multiple'
        };

        if (subject && OPENTDB_SUBJECT_MAP[subject]) {
            params.category = OPENTDB_SUBJECT_MAP[subject];
        }

        if (difficulty && DIFFICULTY_MAP[difficulty]) {
            params.difficulty = DIFFICULTY_MAP[difficulty];
        }

        console.log(`[OpenTDB] Fetching ${params.amount} questions...`, params);

        const response = await axios.get(OPENTDB_BASE_URL, { params, timeout: 10000 });

        if (response.data.response_code !== 0) {
            console.warn(`[OpenTDB] response_code: ${response.data.response_code}`);
            if (response.data.response_code === 1 && params.category) {
                delete params.category;
                const retry = await axios.get(OPENTDB_BASE_URL, { params, timeout: 10000 });
                if (retry.data.response_code !== 0) return [];
                response.data = retry.data;
            } else {
                return [];
            }
        }

        const questions = response.data.results.map(q => {
            const correctAnswer = decodeHTMLEntities(q.correct_answer);
            const incorrectAnswers = q.incorrect_answers.map(a => decodeHTMLEntities(a));

            const allOptions = shuffleArray([
                { text: correctAnswer, isCorrect: true },
                ...incorrectAnswers.map(a => ({ text: a, isCorrect: false }))
            ]);

            const diff = DIFFICULTY_MAP[q.difficulty] || 'medium';

            return {
                questionText: decodeHTMLEntities(q.question),
                questionType: 'multiple-choice',
                options: allOptions,
                correctAnswer: correctAnswer,
                difficulty: diff,
                difficultyScore: diff === 'easy' ? 3 : diff === 'medium' ? 5 : 8,
                expectedTime: diff === 'easy' ? 30 : diff === 'medium' ? 60 : 90,
                tags: [decodeHTMLEntities(q.category)],
                explanation: `Category: ${decodeHTMLEntities(q.category)}`,
                hints: [`This is a ${q.difficulty} level question from ${decodeHTMLEntities(q.category)}`],
                status: 'active',
                source: 'opentdb',
                statistics: {
                    totalAttempts: 0,
                    correctAttempts: 0,
                    averageTime: 0
                }
            };
        });

        console.log(`[OpenTDB] Successfully fetched ${questions.length} questions`);
        return questions;

    } catch (error) {
        console.error('[OpenTDB] Error:', error.message);
        return [];
    }
}

// ============================================
// MAIN: Smart Question Fetcher
// Picks the right API based on subject
// ============================================
async function fetchQuestionsFromOpenTDB(count = 10, subject = null, difficulty = null) {
    const isProgrammingSubject = subject && QUIZAPI_SUBJECT_MAP[subject];

    let questions = [];

    if (isProgrammingSubject) {
        // Try QuizAPI.io first for programming subjects
        console.log(`[SmartFetch] "${subject}" is a programming subject, trying QuizAPI.io...`);
        questions = await fetchFromQuizAPI(count, subject, difficulty);

        // If QuizAPI didn't return enough, try OpenTDB as backup
        if (questions.length < count) {
            const remaining = count - questions.length;
            console.log(`[SmartFetch] QuizAPI returned ${questions.length}/${count}. Trying OpenTDB for ${remaining} more...`);
            const extraQuestions = await fetchFromOpenTDB(remaining, subject, difficulty);
            questions = [...questions, ...extraQuestions];
        }
    } else {
        // Use OpenTDB for general/non-programming subjects
        console.log(`[SmartFetch] "${subject || 'General'}" using OpenTDB...`);
        questions = await fetchFromOpenTDB(count, subject, difficulty);
    }

    console.log(`[SmartFetch] Total questions fetched: ${questions.length}`);
    return questions;
}

module.exports = {
    fetchQuestionsFromOpenTDB,
    QUIZAPI_SUBJECT_MAP,
    OPENTDB_SUBJECT_MAP,
    decodeHTMLEntities
};

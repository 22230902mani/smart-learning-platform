// Cleanup script: Remove non-subject-specific questions that were incorrectly saved
// from OpenTDB (general trivia saved under programming topics)

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Question = require('../models/Question');

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find and delete questions that came from external sources (opentdb)
        // These are the junk random trivia saved under programming topics
        const result = await Question.deleteMany({ source: 'opentdb' });
        console.log(`Deleted ${result.deletedCount} external (opentdb) questions`);

        // Also find questions with general trivia text patterns under programming topics
        const junkPatterns = [
            /World Wide Web/i,
            /CPU stand for/i,
            /What year was/i,
            /Which country/i,
            /Who invented/i,
            /World War/i,
        ];

        let junkDeleted = 0;
        for (const pattern of junkPatterns) {
            const res = await Question.deleteMany({ questionText: pattern });
            junkDeleted += res.deletedCount;
        }
        console.log(`Deleted ${junkDeleted} additional junk questions by pattern`);

        // Show remaining question count
        const Topic = require('../models/Topic');
        const topics = await Topic.find({});
        for (const topic of topics) {
            const count = await Question.countDocuments({ topicId: topic._id });
            if (count > 0) {
                console.log(`  ${topic.subject} / ${topic.topic}: ${count} questions`);
            }
        }

        const totalQuestions = await Question.countDocuments({});
        console.log(`\nTotal questions remaining: ${totalQuestions}`);

        await mongoose.disconnect();
        console.log('Done!');
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

cleanup();

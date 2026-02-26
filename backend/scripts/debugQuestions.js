const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Topic = require('../models/Topic');
const Question = require('../models/Question');

async function debug() {
    await mongoose.connect(process.env.MONGODB_URI);

    const topics = await Topic.find({ subject: 'C++' });
    console.log('C++ topics found:', topics.length);
    topics.forEach(t => console.log(`  - ${t.subject} / ${t.topic} / ${t.subtopic} (ID: ${t._id})`));

    const topicIds = topics.map(t => t._id);
    const qs = await Question.find({ topicId: { $in: topicIds }, status: 'active' });
    console.log(`\nC++ questions in DB: ${qs.length}`);
    qs.forEach(q => console.log(`  - [${q.source || 'no-source'}] ${q.questionText.substring(0, 70)}`));

    // Check questions with NO topicFilter (what happens when filter is empty)
    const allQs = await Question.countDocuments({ status: 'active' });
    console.log(`\nTotal active questions in entire DB: ${allQs}`);

    // Sample 5 random questions
    const sample = await Question.find({ status: 'active' }).limit(5);
    console.log('\nSample of ALL questions (first 5):');
    sample.forEach(q => console.log(`  - ${q.questionText.substring(0, 70)}`));

    await mongoose.disconnect();
}
debug();

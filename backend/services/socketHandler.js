const socketIO = require('socket.io');
const LiveQuiz = require('../models/LiveQuiz');

const socketHandler = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Namespace or Room based logic
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join-quiz', async ({ quizId, user }) => {
            try {
                if (!quizId || !user) return;

                socket.join(quizId);
                console.log(`User ${user.name} joined room: ${quizId}`);

                // Update participants in DB
                const quiz = await LiveQuiz.findById(quizId);
                if (quiz) {
                    const existingParticipant = quiz.participants.find(p => p.user.toString() === user._id);

                    if (!existingParticipant) {
                        quiz.participants.push({
                            user: user._id,
                            name: user.name,
                            score: 0,
                            accuracy: 0,
                            completed: false
                        });
                        await quiz.save();
                    }

                    // Always notify everyone (including the newly joined user) of the current participant state
                    io.to(quizId).emit('participant-joined', {
                        participants: quiz.participants,
                        count: quiz.participants.length
                    });

                    console.log(`Broadcasted participant-joined to room ${quizId}. Total: ${quiz.participants.length}`);
                }
            } catch (error) {
                console.error('Error joining quiz:', error);
            }
        });

        socket.on('start-quiz', async ({ quizId }) => {
            try {
                const quiz = await LiveQuiz.findByIdAndUpdate(quizId, {
                    status: 'live',
                    startTime: new Date()
                }, { new: true });

                io.to(quizId).emit('quiz-started', { quiz });
            } catch (error) {
                console.error('Error starting quiz:', error);
            }
        });

        socket.on('submit-answer', async ({ quizId, userId, score, accuracy }) => {
            try {
                const quiz = await LiveQuiz.findById(quizId);
                if (quiz) {
                    const participant = quiz.participants.find(p => p.user.toString() === userId);
                    if (participant) {
                        participant.score = score;
                        participant.accuracy = accuracy;
                        participant.completed = true;
                        participant.lastUpdated = new Date();
                    }
                    await quiz.save();

                    // Send update for real-time leaderboard
                    io.to(quizId).emit('leaderboard-update', {
                        participants: quiz.participants
                    });

                    // Check if all participants finished
                    const allFinished = quiz.participants.every(p => p.completed);
                    if (allFinished) {
                        // Optional: auto end quiz? or wait for teacher
                    }
                }
            } catch (error) {
                console.error('Error submitting answer:', error);
            }
        });

        socket.on('end-quiz', async ({ quizId }) => {
            try {
                const quiz = await LiveQuiz.findByIdAndUpdate(quizId, {
                    status: 'finished',
                    endTime: new Date()
                }, { new: true });

                io.to(quizId).emit('quiz-ended', { quiz });
            } catch (error) {
                console.error('Error ending quiz:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

module.exports = socketHandler;

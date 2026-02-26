import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { liveQuizAPI } from '../../services/api';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import './LiveQuiz.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const LiveQuizSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [socket, setSocket] = useState(null);
    const [status, setStatus] = useState('waiting');
    const [results, setResults] = useState(null);
    const [participants, setParticipants] = useState([]);
    const timerRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchQuiz();
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        // Anti-cheat: tab switching detection
        const handleVisibilityChange = () => {
            if (document.hidden && status === 'live' && !isFinished && user?.role === 'student') {
                toast('⚠️ Warning: Tab switching detected!', {
                    icon: '🚫',
                    style: {
                        borderRadius: '10px',
                        background: '#111827',
                        color: '#f87171',
                        border: '1px solid #f87171'
                    },
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            newSocket.close();
            if (timerRef.current) clearInterval(timerRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [id, status, isFinished]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('join-quiz', { quizId: id, user });

        socket.on('participant-joined', (data) => {
            setParticipants(data.participants);
            if (status === 'waiting') {
                toast.success('Joined the session!');
            }
        });

        socket.on('quiz-started', (data) => {
            setQuiz(data.quiz);
            setStatus('live');
            setTimeLeft(data.quiz.timeLimit * 60);
            startTimer();
        });

        socket.on('quiz-ended', (data) => {
            setQuiz(data.quiz);
            setStatus('finished');
            finishQuiz(data.quiz);
        });

        socket.on('leaderboard-update', (data) => {
            setParticipants(data.participants);
        });

        return () => {
            socket.off('participant-joined');
            socket.off('quiz-started');
            socket.off('quiz-ended');
            socket.off('leaderboard-update');
        };
    }, [socket, id, status]);

    const fetchQuiz = async () => {
        try {
            const response = await liveQuizAPI.getDetails(id);
            const q = response.data.data;
            setQuiz(q);
            setStatus(q.status);
            setParticipants(q.participants || []);

            if (q.status === 'live') {
                // Approximate time left if already started
                const startTime = new Date(q.startTime).getTime();
                const now = new Date().getTime();
                const elapsed = Math.floor((now - startTime) / 1000);
                const remaining = (q.timeLimit * 60) - elapsed;

                if (remaining > 0) {
                    setTimeLeft(remaining);
                    startTimer();
                } else {
                    finishQuiz(q);
                }
            } else if (q.status === 'finished') {
                finishQuiz(q);
            }
        } catch (error) {
            toast.error('Failed to load quiz');
            navigate('/dashboard');
        }
    };

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    finishQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleAnswer = (optionIdx) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIdx] = optionIdx;
        setAnswers(newAnswers);

        // Auto move to next question if not the last one
        if (currentQuestionIdx < quiz.questions.length - 1) {
            setTimeout(() => setCurrentQuestionIdx(prev => prev + 1), 300);
        }
    };

    const finishQuiz = (finalQuizData = quiz) => {
        if (isFinished) return;
        setIsFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);

        // Calculate score
        let correctCount = 0;
        finalQuizData.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / finalQuizData.questions.length) * 100);
        const accuracy = score;

        setResults({
            correctCount,
            total: finalQuizData.questions.length,
            score,
            accuracy
        });

        // Submit to backend via socket for live leaderboard
        socket.emit('submit-answer', {
            quizId: id,
            userId: user._id,
            score,
            accuracy
        });
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!quiz) return <div className="live-quiz-container"><p>Connecting...</p></div>;

    if (status === 'waiting') {
        const isUserJoined = participants.find(p => p.user._id === user._id || p.user === user._id);

        return (
            <div className="live-quiz-container waiting-screen">
                <h1 className="live-quiz-title">Waiting for session...</h1>
                <p className="live-quiz-subtitle">The teacher will start the quiz soon.</p>

                <div className="lobby-grid">
                    <div className="live-quiz-card" style={{ textAlign: 'center' }}>
                        <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
                        {isUserJoined ? (
                            <div className="joined-indicator">
                                <span className="status-dot online"></span>
                                <p style={{ color: '#39FF14', fontWeight: 'bold' }}>You are joined!</p>
                            </div>
                        ) : (
                            <p>Authenticating your connection...</p>
                        )}
                        <p style={{ marginTop: '1rem', color: '#9ca3af' }}>Ready to play as <b>{user.name}</b></p>
                    </div>

                    <div className="live-quiz-card">
                        <h3 className="section-title">Others in Lobby ({participants.length})</h3>
                        <div className="participants-list mini-list" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                            {participants.length === 0 ? (
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>You're the first one here!</p>
                            ) : (
                                participants.map((p, idx) => (
                                    <div key={idx} className="participant-item-small">
                                        <div className="p-dot"></div>
                                        <span>{p.name} {p.user?._id === user._id || p.user === user._id ? '(You)' : ''}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Information Section */}
                <div className="live-quiz-card info-guidelines-card animated-fade-in" style={{ marginTop: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
                    <h3 className="section-title" style={{ color: '#3B82F6', marginBottom: '1.5rem' }}>⚡ Session Guidelines</h3>
                    <div className="guidelines-grid">
                        <div className="guideline-item">
                            <span className="g-icon">🕒</span>
                            <div>
                                <h4>Pace Yourself</h4>
                                <p>You have {quiz?.timeLimit || 0} minutes. Don't rush, but keep an eye on the clock.</p>
                            </div>
                        </div>
                        <div className="guideline-item">
                            <span className="g-icon">🚫</span>
                            <div>
                                <h4>No Tab Switching</h4>
                                <p>The system monitors activity. Leaving this tab may be flagged as an attempt to cheat.</p>
                            </div>
                        </div>
                        <div className="guideline-item">
                            <span className="g-icon">🎯</span>
                            <div>
                                <h4>Accuracy Matters</h4>
                                <p>Points are awarded based on both correct answers and speed. Accuracy is key!</p>
                            </div>
                        </div>
                        <div className="guideline-item">
                            <span className="g-icon">📡</span>
                            <div>
                                <h4>Stay Connected</h4>
                                <p>Ensure you have a stable connection. If you disconnect, try refreshing this page instantly.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Admin / Teacher View (Leaderboard)
    if (user.role === 'admin') {
        const sortedParticipants = [...(participants || [])].sort((a, b) => b.score - a.score);

        return (
            <div className="live-quiz-container">
                <div className="quiz-header">
                    <div>
                        <p style={{ color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase' }}>Live Dashboard</p>
                        <h2 style={{ margin: 0 }}>{quiz.title}</h2>
                    </div>
                </div>

                <div className="lobby-grid">
                    <div className="live-quiz-card">
                        <h3 className="section-title">Session Stats</h3>
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Time Remaining</p>
                                <h2 style={{ color: '#f87171' }}>{formatTime(timeLeft)}</h2>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Join Code</p>
                                <h2 style={{ color: '#3B82F6' }}>{quiz.joinId}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="live-quiz-card">
                        <h3 className="section-title">Live Leaderboard</h3>
                        <div className="participants-list" style={{ marginTop: '1rem' }}>
                            {sortedParticipants.length === 0 ? (
                                <p style={{ color: '#9ca3af' }}>No students have joined.</p>
                            ) : (
                                sortedParticipants.map((p, idx) => (
                                    <div key={idx} className="participant-item">
                                        <div className="participant-avatar" style={{
                                            background: idx === 0 ? '#fbbf24' : (idx === 1 ? '#94a3b8' : (idx === 2 ? '#b45309' : undefined))
                                        }}>
                                            {idx + 1}
                                        </div>
                                        <div className="participant-info" style={{ flex: 1 }}>
                                            <p style={{ fontWeight: '600' }}>{p.name}</p>
                                            <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                                                {p.completed ? 'Finished' : 'In Progress'}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontWeight: '800', color: '#3B82F6' }}>{p.score}%</p>
                                            <p style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Acc: {p.accuracy}%</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="lobby-actions">
                    <button className="btn-remove" onClick={() => socket.emit('end-quiz', { quizId: id })}>
                        🛑 Force End Quiz
                    </button>
                </div>
            </div>
        );
    }

    if (isFinished || status === 'finished') {
        return (
            <div className="live-quiz-container">
                <div className="live-quiz-header">
                    <h1 className="live-quiz-title">Quiz Completed!</h1>
                    <p className="live-quiz-subtitle">Review your performance</p>
                </div>

                <div className="live-quiz-card animated-fade-in" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h2 style={{ fontSize: '3rem', color: '#3B82F6', marginBottom: '1rem' }}>{results?.score || 0}%</h2>
                    <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>You answered {results?.correctCount || 0} out of {results?.total || 0} questions correctly.</p>

                    <div className="lobby-grid" style={{ marginBottom: '2rem' }}>
                        <div className="stat-box" style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '1rem' }}>
                            <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Accuracy</p>
                            <h3 style={{ fontSize: '1.5rem' }}>{results?.accuracy || 0}%</h3>
                        </div>
                        <div className="stat-box" style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '1rem' }}>
                            <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Rank</p>
                            <h3 style={{ fontSize: '1.5rem' }}>Processing...</h3>
                        </div>
                    </div>

                    <button className="btn-primary" onClick={() => navigate('/live-quiz/history')}>
                        📜 View My History
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = quiz.questions[currentQuestionIdx];
    const progress = ((currentQuestionIdx + 1) / quiz.questions.length) * 100;

    return (
        <div className="live-quiz-container">
            <div className="quiz-header">
                <div>
                    <p style={{ color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{quiz.subject}</p>
                    <h2 style={{ margin: 0 }}>{quiz.title}</h2>
                </div>
                <div className="timer-box">
                    <span>⏱️</span>
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="live-quiz-card question-display animated-fade-in">
                <p style={{ color: '#3B82F6', fontWeight: '800', marginBottom: '0.5rem' }}>QUESTION {currentQuestionIdx + 1} OF {quiz.questions.length}</p>
                <h3 className="question-text">{currentQ.questionText}</h3>

                <div className="quiz-options">
                    {currentQ.options.map((opt, idx) => (
                        <button
                            key={idx}
                            className={`quiz-option-btn ${answers[currentQuestionIdx] === idx ? 'selected' : ''}`}
                            onClick={() => handleAnswer(idx)}
                        >
                            <div className="option-marker">{String.fromCharCode(65 + idx)}</div>
                            <span>{opt}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-actions" style={{ justifyContent: 'space-between' }}>
                <button
                    className="btn-secondary"
                    onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIdx === 0}
                >
                    Prev
                </button>

                {currentQuestionIdx === quiz.questions.length - 1 ? (
                    <button className="btn-primary" onClick={() => finishQuiz()}>
                        Finish Quiz
                    </button>
                ) : (
                    <button
                        className="btn-primary"
                        onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default LiveQuizSession;

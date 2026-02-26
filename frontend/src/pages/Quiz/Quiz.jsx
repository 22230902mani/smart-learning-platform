import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { quizAPI, topicsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './Quiz.css';

const Quiz = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [mode, setMode] = useState(searchParams.get('mode') || 'practice');
    const [topics, setTopics] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || '');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [questionCount, setQuestionCount] = useState(10);
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [startTime, setStartTime] = useState(null);

    const questionCountOptions = [5, 10, 15, 20, 25, 30];

    // Persist quiz state to localStorage
    useEffect(() => {
        if (quiz) {
            const quizState = {
                quiz,
                currentQuestionIndex,
                mode,
                timeLeft,
                startTime: Date.now() // Reset start time on refresh to prevent negative elapsed time
            };
            localStorage.setItem('active_quiz', JSON.stringify(quizState));
        }
    }, [quiz, currentQuestionIndex, mode, timeLeft]);

    // Restore quiz state from localStorage on mount
    useEffect(() => {
        const savedQuiz = localStorage.getItem('active_quiz');
        if (savedQuiz) {
            try {
                const { quiz: sQuiz, currentQuestionIndex: sIndex, mode: sMode, timeLeft: sTime } = JSON.parse(savedQuiz);
                setQuiz(sQuiz);
                setCurrentQuestionIndex(sIndex);
                setMode(sMode);
                setTimeLeft(sTime);
                setStartTime(Date.now());
                toast.success('Resumed your session!');
            } catch (err) {
                localStorage.removeItem('active_quiz');
            }
        }
        fetchTopics();
    }, []);

    useEffect(() => {
        if (mode === 'timed' && quiz && timeLeft === null) {
            const totalTime = quiz.questions.length * 60; // 1 minute per question
            setTimeLeft(totalTime);
        }
    }, [quiz, mode]);

    // Auto-start logic if coming from dashboard featured links
    useEffect(() => {
        const shouldAutoStart = searchParams.get('auto') === 'true';
        if (shouldAutoStart && selectedSubject && !quiz && !loading && topics.length > 0) {
            handleStartQuiz();
        }
    }, [topics, selectedSubject, quiz, loading, searchParams]);

    useEffect(() => {
        if (timeLeft !== null && timeLeft > 0 && quiz) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            handleSubmitQuiz();
        }
    }, [timeLeft]);

    const fetchTopics = async () => {
        try {
            const response = await topicsAPI.getAll();
            setTopics(response.data.data.topics || []);
        } catch (error) {
            toast.error('Failed to load topics');
        }
    };

    const handleStartQuiz = async () => {
        if (!mode) {
            toast.error('Please select a quiz mode');
            return;
        }

        setLoading(true);
        try {
            // Reset timer and other states for a fresh quiz
            setTimeLeft(null);
            setSelectedAnswer('');
            setCurrentQuestionIndex(0);

            const response = await quizAPI.startQuiz({
                mode,
                topicId: selectedTopic || undefined,
                subject: selectedSubject || undefined,
                questionCount
            });

            if (!response.data.data.questions || response.data.data.questions.length === 0) {
                throw new Error('No questions found for the selected criteria');
            }

            setQuiz(response.data.data);
            setStartTime(Date.now());
            toast.success(`${mode.charAt(0).toUpperCase() + mode.slice(1)} quiz started!`);
        } catch (error) {
            console.error('Quiz start error:', error);
            toast.error(error.message || error.response?.data?.message || 'Failed to start quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!selectedAnswer) {
            toast.error('Please select an answer');
            return;
        }

        const currentQuestion = quiz.questions[currentQuestionIndex];
        const responseTime = Math.floor((Date.now() - startTime) / 1000);

        try {
            await quizAPI.submitAnswer({
                sessionId: quiz.sessionId,
                questionId: currentQuestion._id,
                selectedAnswer,
                responseTime,
                mode,
                confidence: 'medium'
            });

            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer('');
                setStartTime(Date.now());
            } else {
                handleSubmitQuiz();
            }
        } catch (error) {
            console.error('Submit answer error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit answer');
        }
    };

    const handleSubmitQuiz = () => {
        localStorage.removeItem('active_quiz');
        navigate(`/results/${quiz.sessionId}`);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!quiz) {
        // Get unique subjects from topics
        const subjects = [...new Set(topics.map(t => t.subject))].sort();

        // Filter topics by selected subject
        const filteredTopics = selectedSubject
            ? topics.filter(t => t.subject === selectedSubject)
            : topics;

        return (
            <div className="container quiz-setup">
                <div className="quiz-setup-card card">
                    <h1 className="quiz-title">🎯 Start New Quiz</h1>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Choose your subject and challenge yourself!
                    </p>

                    <div className="form-group">
                        <label className="form-label">Quiz Mode</label>
                        <div className="mode-selection">
                            <div
                                className={`mode-card ${mode === 'practice' ? 'selected' : ''}`}
                                onClick={() => setMode('practice')}
                            >
                                <div className="mode-icon-wrapper practice">
                                    <span className="mode-icon">📚</span>
                                </div>
                                <div className="mode-details">
                                    <h3>Practice Mode</h3>
                                    <p>Learn at your own pace with untimed questions</p>
                                </div>
                                {mode === 'practice' && <div className="mode-active-indicator">✓</div>}
                            </div>

                            <div
                                className={`mode-card ${mode === 'timed' ? 'selected' : ''}`}
                                onClick={() => setMode('timed')}
                            >
                                <div className="mode-icon-wrapper timed">
                                    <span className="mode-icon">⏱️</span>
                                </div>
                                <div className="mode-details">
                                    <h3>Timed Assessment</h3>
                                    <p>Simulate exam conditions with 1-min limits</p>
                                </div>
                                {mode === 'timed' && <div className="mode-active-indicator">✓</div>}
                            </div>

                            <div
                                className={`mode-card ${mode === 'revision' ? 'selected' : ''}`}
                                onClick={() => setMode('revision')}
                            >
                                <div className="mode-icon-wrapper revision">
                                    <span className="mode-icon">🔄</span>
                                </div>
                                <div className="mode-details">
                                    <h3>Revision Mode</h3>
                                    <p>Focus specifically on your past mistakes</p>
                                </div>
                                {mode === 'revision' && <div className="mode-active-indicator">✓</div>}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            📘 Select Subject {selectedSubject && <span style={{ color: 'var(--primary-600)', fontWeight: 'bold' }}>({selectedSubject})</span>}
                        </label>
                        <select
                            className="form-input"
                            value={selectedSubject}
                            onChange={(e) => {
                                setSelectedSubject(e.target.value);
                                setSelectedTopic(''); // Reset topic when subject changes
                            }}
                        >
                            <option value="">All Subjects</option>
                            {subjects.map((subject) => (
                                <option key={subject} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            📝 Select Topic (Optional)
                        </label>
                        <select
                            className="form-input"
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                        >
                            <option value="">
                                {selectedSubject
                                    ? `All ${selectedSubject} Topics`
                                    : 'All Topics'}
                            </option>
                            {filteredTopics.map((topic) => (
                                <option key={topic._id} value={topic._id}>
                                    {topic.subject} → {topic.topic} → {topic.concept}
                                </option>
                            ))}
                        </select>
                        {filteredTopics.length > 0 && (
                            <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
                                {filteredTopics.length} topic{filteredTopics.length !== 1 ? 's' : ''} available
                            </small>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            🔢 Number of Questions
                        </label>
                        <div className="question-count-selection">
                            {questionCountOptions.map((count) => (
                                <button
                                    key={count}
                                    className={`count-btn ${questionCount === count ? 'active' : ''}`}
                                    onClick={() => setQuestionCount(count)}
                                >
                                    <span className="count-value">{count}</span>
                                    <span className="count-label">MCQs</span>
                                </button>
                            ))}
                        </div>
                        <small style={{ color: 'var(--text-secondary, #64748b)', marginTop: '0.75rem', display: 'block', textAlign: 'center' }}>
                            Selected: <strong style={{ color: '#F97316' }}>{questionCount} questions</strong> will appear in your quiz
                        </small>
                    </div>

                    <button
                        className="btn btn-primary btn-block"
                        onClick={handleStartQuiz}
                        disabled={loading}
                    >
                        {loading ? '🔄 Starting...' : '🚀 Start Quiz'}
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    // Safety check for currentQuestion
    if (!currentQuestion) {
        return (
            <div className="container quiz-container">
                <div className="card">
                    <h2>Error loading question</h2>
                    <p>Unable to load the current question. Please try again.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/quiz')}>
                        Back to Quiz Setup
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container quiz-container">
            <div className="quiz-header">
                <div className="quiz-progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="quiz-info">
                    <span className="question-counter">
                        Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </span>
                    {mode === 'timed' && timeLeft !== null && (
                        <span className={`timer ${timeLeft < 60 ? 'timer-warning' : ''}`}>
                            ⏱️ {formatTime(timeLeft)}
                        </span>
                    )}
                    <span className="badge badge-info">{mode}</span>
                </div>
            </div>

            <div className="question-card card">
                <div className="question-header">
                    <span className="difficulty-badge badge" data-difficulty={currentQuestion?.difficulty || 'medium'}>
                        {currentQuestion?.difficulty || 'medium'}
                    </span>
                    <span className="expected-time">⏱️ {currentQuestion?.expectedTime || 60}s</span>
                </div>

                <h2 className="question-text">{currentQuestion?.questionText || 'Question text not available'}</h2>

                <div className="options-list">
                    {(currentQuestion?.options || []).map((option, index) => (
                        <label
                            key={index}
                            className={`option-item ${selectedAnswer === option.text ? 'selected' : ''}`}
                        >
                            <input
                                type="radio"
                                name="answer"
                                value={option.text}
                                checked={selectedAnswer === option.text}
                                onChange={(e) => setSelectedAnswer(e.target.value)}
                            />
                            <span className="option-label">{String.fromCharCode(65 + index)}</span>
                            <span className="option-text">{option.text}</span>
                        </label>
                    ))}
                </div>

                {currentQuestion?.hints?.length > 0 && (
                    <details className="hints-section">
                        <summary>💡 Show Hint</summary>
                        <p>{currentQuestion.hints[0]}</p>
                    </details>
                )}

                <div className="quiz-actions">
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmitAnswer}
                        disabled={!selectedAnswer}
                    >
                        {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Quiz;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { liveQuizAPI, topicsAPI, quizAPI } from '../../services/api';
import axios from 'axios';
import toast from 'react-hot-toast';
import './LiveQuiz.css';

const CreateLiveQuiz = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [creationMode, setCreationMode] = useState('manual'); // 'manual' or 'auto'
    const [topics, setTopics] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [questionCount, setQuestionCount] = useState(10);
    const [quizData, setQuizData] = useState({
        title: '',
        subject: '',
        timeLimit: 10,
        questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]
    });

    React.useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await topicsAPI.getAll();
            setTopics(response.data.data.topics || []);
        } catch (error) {
            toast.error('Failed to load topics');
        }
    };

    const handleGenerateQuestions = async () => {
        if (!selectedSubject) {
            return toast.error('Please select a subject first');
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/live-quiz/generate', {
                subject: selectedSubject,
                topicId: selectedTopic || undefined,
                count: questionCount
            });

            const fetchedQuestions = response.data.data;

            if (!fetchedQuestions || fetchedQuestions.length === 0) {
                throw new Error('No questions found for the selected criteria');
            }

            setQuizData({
                ...quizData,
                title: `${selectedSubject} Live Battle`,
                subject: selectedSubject,
                questions: fetchedQuestions
            });

            setCreationMode('manual'); // Switch to manual so they can review
            toast.success(`Generated ${fetchedQuestions.length} questions!`);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to generate questions');
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = () => {
        setQuizData({
            ...quizData,
            questions: [...quizData.questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]
        });
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = quizData.questions.filter((_, i) => i !== index);
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[index].questionText = value;
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const handleCorrectAnswerChange = (qIndex, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[qIndex].correctAnswer = parseInt(value);
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!quizData.title || !quizData.subject) {
            return toast.error('Please fill in all required fields');
        }

        for (let i = 0; i < quizData.questions.length; i++) {
            const q = quizData.questions[i];
            if (!q.questionText || q.options.some(o => !o)) {
                return toast.error(`Please complete question #${i + 1}`);
            }
        }

        setLoading(true);
        try {
            const response = await liveQuizAPI.create(quizData);
            toast.success('Quiz created successfully!');
            navigate(`/live-quiz/lobby/${response.data.data._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="live-quiz-container">
            <div className="live-quiz-header">
                <h1 className="live-quiz-title">Create Live Quiz</h1>
                <p className="live-quiz-subtitle">Design your real-time assessment</p>
            </div>

            <form onSubmit={handleSubmit} className="live-quiz-form">
                <div className="live-quiz-card creation-mode-card">
                    <label className="form-label">Creation Mode</label>
                    <div className="creation-mode-toggle">
                        <button
                            type="button"
                            className={`mode-btn ${creationMode === 'manual' ? 'active' : ''}`}
                            onClick={() => setCreationMode('manual')}
                        >
                            ✍️ Manual Entry
                        </button>
                        <button
                            type="button"
                            className={`mode-btn ${creationMode === 'auto' ? 'active' : ''}`}
                            onClick={() => setCreationMode('auto')}
                        >
                            🤖 AI Generation
                        </button>
                    </div>
                </div>

                {creationMode === 'auto' ? (
                    <div className="live-quiz-card ai-generation-card animated-fade-in">
                        <div className="form-row">
                            <div className="form-group flex-2">
                                <label>Select Subject</label>
                                <select
                                    className="form-input"
                                    value={selectedSubject}
                                    onChange={(e) => {
                                        setSelectedSubject(e.target.value);
                                        setSelectedTopic('');
                                    }}
                                >
                                    <option value="">All Subjects</option>
                                    {[...new Set(topics.map(t => t.subject))].sort().map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group flex-2">
                                <label>Topic (Optional)</label>
                                <select
                                    className="form-input"
                                    value={selectedTopic}
                                    onChange={(e) => setSelectedTopic(e.target.value)}
                                >
                                    <option value="">{selectedSubject ? `All ${selectedSubject} Topics` : 'All Topics'}</option>
                                    {topics.filter(t => !selectedSubject || t.subject === selectedSubject).map(t => (
                                        <option key={t._id} value={t._id}>{t.topic}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Questions</label>
                                <select
                                    className="form-input"
                                    value={questionCount}
                                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                >
                                    {[5, 10, 15, 20, 25, 30].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn-generate"
                            onClick={handleGenerateQuestions}
                            disabled={loading}
                        >
                            {loading ? 'Generating...' : '🛠️ Generate Question List'}
                        </button>
                    </div>
                ) : (
                    <div className="live-quiz-card main-info-card">
                        <div className="form-row">
                            <div className="form-group flex-2">
                                <label>Quiz Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. JavaScript Fundamentals"
                                    value={quizData.title}
                                    onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Science"
                                    value={quizData.subject}
                                    onChange={(e) => setQuizData({ ...quizData, subject: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Time Limit (Min)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quizData.timeLimit}
                                    onChange={(e) => setQuizData({ ...quizData, timeLimit: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="questions-section">
                    <h2 className="section-title">Questions ({quizData.questions.length})</h2>

                    {quizData.questions.map((q, qIndex) => (
                        <div key={qIndex} className="live-quiz-card question-card animated-fade-in">
                            <div className="question-header">
                                <h3>Question #{qIndex + 1}</h3>
                                {quizData.questions.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn-remove"
                                        onClick={() => handleRemoveQuestion(qIndex)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Question Text</label>
                                <textarea
                                    placeholder="Enter your question here..."
                                    value={q.questionText}
                                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                    required
                                />
                            </div>

                            <div className="options-grid">
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className={`option-group ${q.correctAnswer === oIndex ? 'correct' : ''}`}>
                                        <div className="option-input-wrapper">
                                            <span className="option-label">Option {String.fromCharCode(65 + oIndex)}</span>
                                            <input
                                                type="text"
                                                placeholder={`Option ${oIndex + 1}`}
                                                value={opt}
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                required
                                            />
                                        </div>
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name={`correct-${qIndex}`}
                                                checked={q.correctAnswer === oIndex}
                                                onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                            />
                                            <span>Correct</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="form-actions mobile-fixed-tray">
                        <button type="button" className="btn-secondary" onClick={handleAddQuestion}>
                            ➕ Add Question
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : '🚀 Create & Start Quiz'}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default CreateLiveQuiz;

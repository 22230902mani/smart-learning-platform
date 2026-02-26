import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './QuizResults.css';

const QuizResults = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, [sessionId]);

    const fetchResults = async () => {
        try {
            const response = await quizAPI.getResults(sessionId);
            setResults(response.data.data);
        } catch (error) {
            toast.error('Failed to load results');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="results-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!results) return null;

    // Calculate Chart Data
    const generateLineChartPoints = () => {
        if (!results.attempts || results.attempts.length === 0) return "0,100 200,100";
        const width = 200;
        const height = 100;
        const step = width / (results.attempts.length - 1 || 1);
        const times = results.attempts.map(a => a.responseTime || 0);
        const maxTime = Math.max(...times, 10);
        return results.attempts.map((attempt, index) => {
            const x = index * step;
            const y = height - ((attempt.responseTime / maxTime) * (height - 20));
            return `${x},${y}`;
        }).join(" ");
    };

    // Score circle
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const accuracy = results.accuracy || 0;
    const offset = circumference - ((accuracy / 100) * circumference);

    return (
        <div className="results-container">
            <div className="results-content">
                <div className="results-card">
                    <div className="results-header">
                        <h1 className="results-title">Quiz Completed! 🎉</h1>
                        <p className="results-subtitle">Here is your detailed performance analysis</p>
                    </div>

                    <div className="score-section">
                        <div className="score-circle-container">
                            <svg className="score-ring" viewBox="0 0 200 200">
                                <defs>
                                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#F97316" />
                                        <stop offset="100%" stopColor="#EC4899" />
                                    </linearGradient>
                                </defs>
                                <circle cx="100" cy="100" r={radius} className="score-bg" />
                                <circle cx="100" cy="100" r={radius} className="score-fill"
                                    style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
                                />
                            </svg>
                            <div className="score-content">
                                <span className="score-value">{accuracy}%</span>
                                <span className="score-label">Accuracy</span>
                            </div>
                        </div>

                        <div className="score-stats">
                            <div className="stat-card">
                                <div className="stat-icon">🎯</div>
                                <div><span className="stat-label">Total Questions</span><div className="stat-value">{results.totalQuestions}</div></div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">✅</div>
                                <div><span className="stat-label">Correct Answers</span><div className="stat-value">{results.correctAnswers}</div></div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">❌</div>
                                <div><span className="stat-label">Incorrect</span><div className="stat-value">{results.totalQuestions - results.correctAnswers}</div></div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⏱️</div>
                                <div><span className="stat-label">Avg. Time/Q</span><div className="stat-value">{Number(results.averageTime).toFixed(1)}s</div></div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Charts */}
                    <div className="charts-grid">
                        <div className="chart-card">
                            <h4 className="chart-title">Performance Metrics</h4>
                            <div className="bar-chart">
                                <div className="bar" style={{ height: `${accuracy}%`, background: '#84CC16' }} data-label="Score" />
                                <div className="bar" style={{ height: `${(results.correctAnswers / results.totalQuestions) * 100}%`, background: '#F97316' }} data-label="Correct" />
                                <div className="bar" style={{ height: `${Math.min((results.averageTime / 60) * 100, 100)}%`, background: '#A855F7' }} data-label="Time" />
                                <div className="bar" style={{ height: '100%', opacity: 0.2, background: '#CBD5E1' }} data-label="Target" />
                            </div>
                        </div>
                        <div className="chart-card">
                            <h4 className="chart-title">Response Time Trend</h4>
                            {results.attempts && results.attempts.length > 0 ? (
                                <div className="line-chart">
                                    <svg viewBox="0 0 200 100" className="chart-svg">
                                        <polyline points={generateLineChartPoints()} className="chart-line" />
                                    </svg>
                                </div>
                            ) : (
                                <p style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>No data available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Question Review Section */}
                <div className="attempts-section">
                    <div className="section-header">
                        <h2>📝 Detailed Review</h2>
                    </div>

                    {results.attempts && results.attempts.map((attempt, index) => (
                        <div key={index} className={`attempt-card ${attempt.isCorrect ? 'correct' : 'incorrect'}`}>
                            <div className="attempt-header">
                                <span className="attempt-number">Question {index + 1}</span>
                                <span className={`attempt-result ${attempt.isCorrect ? 'correct' : 'incorrect'}`}>
                                    {attempt.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                                </span>
                            </div>
                            <h3 className="question-text">{attempt.questionId?.questionText || 'Question text unavailable'}</h3>
                            <div className="answer-grid">
                                <div className="answer-box">
                                    <label>Your Answer</label>
                                    <div className={`value ${attempt.isCorrect ? 'correct' : 'incorrect'}`}>{attempt.selectedAnswer}</div>
                                </div>
                                <div className="answer-box">
                                    <label>Correct Answer</label>
                                    <div className="value correct">{attempt.questionId?.correctAnswer || 'N/A'}</div>
                                </div>
                            </div>
                            {attempt.questionId?.explanation && (
                                <div className="explanation-box">
                                    <div className="explanation-title"><span>💡</span> Explanation</div>
                                    <p className="explanation-text">{attempt.questionId.explanation}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="results-actions">
                    <button className="action-btn btn-primary" onClick={() => navigate('/quiz')}>
                        <span>🔄</span> Take Another Quiz
                    </button>
                    <button className="action-btn btn-secondary" onClick={() => navigate('/results')}>
                        <span>📊</span> All Results
                    </button>
                    <button className="action-btn btn-secondary" onClick={() => navigate('/dashboard')}>
                        <span>🏠</span> Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizResults;

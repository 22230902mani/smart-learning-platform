import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './ResultsHistory.css';

const ResultsHistory = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await analyticsAPI.getQuizHistory();
            if (response.data.success) {
                setHistory(response.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load quiz history');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getScoreColor = (correct, total) => {
        const percentage = (correct / total) * 100;
        if (percentage >= 80) return 'good';
        if (percentage >= 50) return 'average';
        return 'poor';
    };

    const getScorePercent = (correct, total) =>
        total > 0 ? Math.round((correct / total) * 100) : 0;

    if (loading) {
        return (
            <div className="results-history-container">
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '6rem', zIndex: 1, position: 'relative' }}>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="results-history-container">
            <div className="rh-page-content">
                <header className="history-header">
                    <div className="history-title-wrap">
                        <h1 className="history-title">Performance History</h1>
                        <p className="history-subtitle">Track your progress and review past quizzes</p>
                    </div>
                    <div className="history-stats">
                        <div className="stat-badge">
                            📊 Total Quizzes: <strong>{history.length}</strong>
                        </div>
                        {history.length > 0 && (
                            <div className="stat-badge">
                                ✅ Avg Score:{' '}
                                <strong>
                                    {Math.round(
                                        history.reduce(
                                            (acc, s) => acc + getScorePercent(s.correctAnswers, s.totalQuestions),
                                            0
                                        ) / history.length
                                    )}%
                                </strong>
                            </div>
                        )}
                    </div>
                </header>

                {history.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📊</span>
                        <h3>No Quiz History Found</h3>
                        <p>It looks like you haven't taken any quizzes yet.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/quiz')}
                        >
                            Start Your First Quiz →
                        </button>
                    </div>
                ) : (
                    <div className="history-grid">
                        {history.map((session, index) => {
                            const pct = getScorePercent(session.correctAnswers, session.totalQuestions);
                            return (
                                <div
                                    key={session._id}
                                    className="rh-card"
                                    onClick={() => navigate(`/results/${session._id}`)}
                                >
                                    {/* Header */}
                                    <div className="rh-card-header">
                                        <div className="rh-test-info">
                                            <div className="rh-test-number">Test #{history.length - index}</div>
                                            <div className="rh-test-date">{formatDate(session.timestamp)}</div>
                                        </div>
                                        <span className={`rh-mode-badge ${session.mode}`}>
                                            {session.mode}
                                        </span>
                                    </div>

                                    {/* Body */}
                                    <div className="rh-card-body">
                                        <div className="rh-subject">
                                            {session.topicDetails?.subject || 'General Knowledge'}
                                        </div>
                                        <div className="rh-topic">
                                            {session.topicDetails?.topic || 'Mixed Topics'}
                                        </div>

                                        <div className="rh-score-container">
                                            <div className="rh-score-item">
                                                <div className="rh-score-label">Score</div>
                                                <div className={`rh-score-value ${getScoreColor(session.correctAnswers, session.totalQuestions)}`}>
                                                    {pct}%
                                                </div>
                                            </div>
                                            <div className="rh-score-divider"></div>
                                            <div className="rh-score-item">
                                                <div className="rh-score-label">Correct</div>
                                                <div className="rh-score-value">
                                                    {session.correctAnswers}/{session.totalQuestions}
                                                </div>
                                            </div>
                                            <div className="rh-score-divider"></div>
                                            <div className="rh-score-item">
                                                <div className="rh-score-label">Avg Time</div>
                                                <div className="rh-score-value">
                                                    {session.avgResponseTime ? session.avgResponseTime.toFixed(1) : 0}s
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer with progress bar */}
                                    <div className="rh-card-footer">
                                        <div className="rh-progress-bar-wrap" title={`${pct}% accuracy`}>
                                            <div
                                                className="rh-progress-bar"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <button className="rh-view-btn">
                                            View Analytics →
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsHistory;

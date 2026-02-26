import React, { useState, useEffect } from 'react';
import { liveQuizAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './LiveQuiz.css';

const LiveQuizHistory = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = user.role === 'admin'
                ? await liveQuizAPI.getCreatorHistory()
                : await liveQuizAPI.getStudentHistory();
            setQuizzes(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch history');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="live-quiz-container"><p>Loading history...</p></div>;

    return (
        <div className="live-quiz-container">
            <div className="live-quiz-header">
                <h1 className="live-quiz-title">Live Quiz History</h1>
                <p className="live-quiz-subtitle">Review your past real-time sessions</p>
            </div>

            <div className="history-list">
                {quizzes.length === 0 ? (
                    <div className="live-quiz-card empty-state" style={{ textAlign: 'center' }}>
                        <p>No quiz history found.</p>
                    </div>
                ) : (
                    quizzes.map((q, idx) => (
                        <div key={idx} className="live-quiz-card history-item animated-fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{q.title}</h3>
                                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{q.subject} • {new Date(q.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        padding: '0.4rem 1rem',
                                        borderRadius: '50px',
                                        fontSize: '0.8rem',
                                        background: q.status === 'finished' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                        color: q.status === 'finished' ? '#10b981' : '#3B82F6',
                                        fontWeight: '700'
                                    }}>
                                        {q.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Questions</p>
                                    <p style={{ fontWeight: '700' }}>{q.questions.length}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Participants</p>
                                    <p style={{ fontWeight: '700' }}>{q.participants.length}</p>
                                </div>
                                {user.role === 'student' && (
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Your Score</p>
                                        <p style={{ fontWeight: '700', color: '#3B82F6' }}>
                                            {q.participants.find(p => p.user === user._id || p.user?._id === user._id)?.score || 0}%
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LiveQuizHistory;

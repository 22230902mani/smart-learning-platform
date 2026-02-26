import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { liveQuizAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './LiveQuiz.css';

const LiveQuizActive = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActiveQuizzes();
    }, []);

    const fetchActiveQuizzes = async () => {
        try {
            const response = await liveQuizAPI.getCreatorHistory();
            // Filter only what is not finished
            const active = response.data.data.filter(q => q.status !== 'finished');
            setQuizzes(active);
        } catch (error) {
            toast.error('Failed to fetch active quizzes');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="live-quiz-container"><p>Loading sessions...</p></div>;

    return (
        <div className="live-quiz-container">
            <div className="live-quiz-header">
                <h1 className="live-quiz-title">Active Sessions</h1>
                <p className="live-quiz-subtitle">Manage your ongoing or waiting quizzes</p>
            </div>

            <div className="active-list">
                {quizzes.length === 0 ? (
                    <div className="live-quiz-card" style={{ textAlign: 'center', padding: '4rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📡</div>
                        <h2 style={{ marginBottom: '1rem' }}>No Active Sessions</h2>
                        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>You don't have any quizzes waiting or in progress.</p>
                        <button className="btn-primary" onClick={() => navigate('/live-quiz/create')}>
                            ➕ Create New Quiz
                        </button>
                    </div>
                ) : (
                    quizzes.map((q, idx) => (
                        <div key={idx} className="live-quiz-card animated-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{q.title}</h3>
                                <p style={{ color: '#9ca3af' }}>{q.subject} • Join ID: <span style={{ color: '#3B82F6', fontWeight: '800' }}>{q.joinId}</span></p>
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: '800',
                                        background: q.status === 'live' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                        color: q.status === 'live' ? '#f87171' : '#3B82F6'
                                    }}>
                                        {q.status.toUpperCase()}
                                    </span>
                                    <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{q.participants.length} students joined</p>
                                </div>
                            </div>
                            <button
                                className="btn-primary"
                                onClick={() => navigate(q.status === 'waiting' ? `/live-quiz/lobby/${q._id}` : `/live-quiz/session/${q._id}`)}
                            >
                                {q.status === 'waiting' ? 'Open Lobby' : 'View Live'}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LiveQuizActive;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { liveQuizAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './LiveQuiz.css';

const JoinLiveQuiz = () => {
    const navigate = useNavigate();
    const [joinId, setJoinId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!joinId) return toast.error('Please enter a Join ID');

        setLoading(true);
        try {
            const response = await liveQuizAPI.join(joinId.toUpperCase());
            toast.success('Joined successfully! Please wait for the teacher.');
            navigate(`/live-quiz/session/${response.data.data._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid Join ID');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="join-quiz-page">
            <div className="join-quiz-container">
                <div className="join-card animated-fade-in">
                    <div className="join-card-header">
                        <div className="join-icon">🎮</div>
                        <h1 className="live-quiz-title">Join Live Battle</h1>
                        <p className="live-quiz-subtitle">Enter the unique code to enter the arena</p>
                    </div>

                    <form onSubmit={handleJoin} className="join-form">
                        <div className="join-input-wrapper">
                            <label className="join-label">SESSION CODE</label>
                            <input
                                type="text"
                                placeholder="E.G. QZ1234"
                                className="join-input"
                                value={joinId}
                                onChange={(e) => setJoinId(e.target.value)}
                                required
                                maxLength={6}
                                autoComplete="off"
                            />
                        </div>
                        <button type="submit" className="btn-primary join-btn" disabled={loading}>
                            {loading ? 'Entering Arena...' : '🔥 JOIN LIVE SESSION'}
                        </button>
                    </form>

                    <div className="join-footer">
                        <span className="join-footer-text">Or scan the QR code on the host's screen</span>
                        <div className="qr-hint-icon">📱</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinLiveQuiz;

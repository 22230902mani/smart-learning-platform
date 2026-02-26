import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { liveQuizAPI } from '../../services/api';
import { io } from 'socket.io-client';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';
import './LiveQuiz.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const LiveQuizLobby = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        fetchQuizDetails();

        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        return () => newSocket.close();
    }, [id]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('join-quiz', {
            quizId: id,
            user: JSON.parse(localStorage.getItem('user'))
        });

        socket.on('participant-joined', (data) => {
            setParticipants(data.participants);
            toast.success('New participant joined!');
        });

        socket.on('quiz-started', () => {
            navigate(`/live-quiz/session/${id}`);
        });

        return () => {
            socket.off('participant-joined');
            socket.off('quiz-started');
        };
    }, [socket, id]);

    const fetchQuizDetails = async () => {
        try {
            const response = await liveQuizAPI.getDetails(id);
            setQuiz(response.data.data);
            setParticipants(response.data.data.participants);
        } catch (error) {
            toast.error('Failed to fetch quiz details');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = () => {
        if (participants.length === 0) {
            return toast.error('Wait for at least one participant to join');
        }
        socket.emit('start-quiz', { quizId: id });
    };

    if (loading) return <div className="live-quiz-container"><p>Loading lobby...</p></div>;

    const joinUrl = `${window.location.origin}/live-quiz/join/${quiz.joinId}`;

    return (
        <div className="live-quiz-container">
            <div className="live-quiz-header">
                <h1 className="live-quiz-title">{quiz.title}</h1>
                <p className="live-quiz-subtitle">{quiz.subject} • {quiz.questions.length} Questions • {quiz.timeLimit} Min</p>
            </div>

            <div className="lobby-grid">
                <div className="live-quiz-card join-info-card">
                    <h3 className="section-title">Scan to Join</h3>
                    <div className="qr-container">
                        <QRCode value={joinUrl} size={200} />
                    </div>
                    <p style={{ color: '#9ca3af' }}>or use this Join ID at <b>/live-quiz/join</b></p>
                    <div className="join-code-box">
                        <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.5rem' }}>JOIN ID</p>
                        <h2>{quiz.joinId}</h2>
                    </div>
                </div>

                <div className="live-quiz-card participants-card">
                    <h3 className="section-title">Participants ({participants.length})</h3>
                    {participants.length === 0 ? (
                        <div className="waiting-screen">
                            <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
                            <p>Waiting for students to join...</p>
                        </div>
                    ) : (
                        <div className="participants-list">
                            {participants.map((p, idx) => (
                                <div key={idx} className="participant-item">
                                    <div className="participant-avatar">
                                        {p.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="participant-info">
                                        <p style={{ fontWeight: '600' }}>{p.name}</p>
                                        <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Ready to play</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="lobby-actions">
                <button
                    className="btn-primary"
                    style={{ padding: '1.25rem 4rem', fontSize: '1.2rem' }}
                    onClick={handleStartQuiz}
                >
                    🚀 Start Quiz Now
                </button>
            </div>
        </div>
    );
};

export default LiveQuizLobby;

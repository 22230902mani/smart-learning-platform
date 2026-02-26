import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizWorkflow.css';

const QuizWorkflow = () => {
    const navigate = useNavigate();

    const subjects = [
        'C', 'C++', 'Java', 'Python', 'JavaScript', 'React', 'Node.js', 'DSA',
        'DBMS', 'HTML', 'CSS', 'MongoDB', 'SQL', 'Angular', 'Vue.js', 'PHP', 'Go',
        'Ruby', 'Swift', 'Kotlin', 'R', 'Machine Learning', 'Data Science', 'More...'
    ];

    const topics = [
        'All Topics', 'Arrays', 'Linked Lists', 'Trees', 'Graphs',
        'Sorting Algorithms', 'e.g. DSA: All Topics, Arrays, Trees...'
    ];

    return (
        <div className="workflow-container">
            {/* Animated Background */}
            <div className="workflow-bg">
                <div className="stars"></div>
                <div className="stars2"></div>
                <div className="stars3"></div>
            </div>

            {/* Hero Section */}
            <div className="workflow-hero animated-fade-in">
                <div className="hero-badge pulse">Real-time Learning</div>
                <h1 className="hero-title">Adaptive Quiz Workflow</h1>
                <p className="hero-subtitle">Experience how SmartPrep AI optimizes your learning path through data-driven assessments.</p>
                <button className="cta-button" onClick={() => navigate('/take-quiz')}>
                    <span className="button-icon">🎮</span>
                    Jump into Action
                    <span className="button-arrow">→</span>
                </button>
            </div>

            {/* Workflow Visualization */}
            <div className="workflow-map">
                <div className="workflow-arrow-down"></div>

                {/* Quiz Setup Screen */}
                <div className="workflow-section setup-section animated-fade-in" style={{ animationDelay: '0.1s' }}>
                    <h2 className="section-title">Step 1: Quiz Configuration</h2>

                    <div className="setup-grid">
                        {/* Mode Selection */}
                        <div className="setup-card mode-card">
                            <div className="card-header">
                                <span className="card-icon">⚡</span>
                                <h3>Pick Your Mode</h3>
                            </div>
                            <div className="mode-options">
                                <div className="mode-option practice-mode">
                                    <div className="mode-icon">📚</div>
                                    <div className="mode-content">
                                        <h4>Practice Mode</h4>
                                        <p>No pressure, learn freely</p>
                                    </div>
                                </div>
                                <div className="mode-option timed-mode">
                                    <div className="mode-icon">⏱️</div>
                                    <div className="mode-content">
                                        <h4>Timed Assessment</h4>
                                        <p>Real exam conditions</p>
                                    </div>
                                </div>
                                <div className="mode-option revision-mode">
                                    <div className="mode-icon">🔄</div>
                                    <div className="mode-content">
                                        <h4>Weakness Target</h4>
                                        <p>AI focuses on your gaps</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="workflow-arrow-right"></div>

                        {/* Subject Selection */}
                        <div className="setup-card subject-card">
                            <div className="card-header">
                                <span className="card-icon">📁</span>
                                <h3>Select Domain</h3>
                            </div>
                            <div className="subject-dropdown-demo">
                                <div className="dropdown-header">Choose Subject <span style={{ fontSize: '0.7rem' }}>▼</span></div>
                                <div className="subject-list scrollable">
                                    {subjects.slice(0, 10).map((subject, index) => (
                                        <div
                                            key={index}
                                            className={`subject-item ${index === 4 ? 'highlighted' : ''}`}
                                        >
                                            {subject}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="selection-note">
                                <span className="note-icon">✨</span>
                                <span>Browsing 22+ Subjects</span>
                            </div>
                        </div>

                        <div className="workflow-arrow-right"></div>

                        {/* Topic Selection */}
                        <div className="setup-card topic-card">
                            <div className="card-header">
                                <span className="card-icon">🎯</span>
                                <h3>Target Topic</h3>
                            </div>
                            <div className="topic-badge">
                                🤖 AI-Filtered Topics
                            </div>
                            <div className="topic-dropdown-demo">
                                <div className="dropdown-header">Quick Search...</div>
                                <div className="topic-list">
                                    {topics.slice(0, 5).map((topic, index) => (
                                        <div key={index} className="topic-item">
                                            {topic}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="selection-note secondary">
                                Specific Topic or "Comprehensive Exam"
                            </div>
                        </div>
                    </div>

                    <button className="start-quiz-btn" onClick={() => navigate('/take-quiz')}>
                        <span>Launch Session</span>
                    </button>
                </div>

                <div className="workflow-arrow-down long"></div>

                {/* Step 2: Live Social Assessment */}
                <div className="workflow-section live-section animated-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h2 className="section-title">Step 2: Social & Live Battles</h2>

                    <div className="live-demo-grid">
                        <div className="glass-card lobby-preview">
                            <div className="card-header">
                                <span className="card-icon">👥</span>
                                <h3>Live Multiplayer Lobby</h3>
                            </div>
                            <div className="lobby-content">
                                <div className="join-code-display">
                                    <span className="code-label">Room Code:</span>
                                    <div className="code-value glow-text">SP-7729</div>
                                </div>
                                <div className="participants-mini-list">
                                    <div className="p-item"><span className="p-dot"></span> User_Alpha (Host)</div>
                                    <div className="p-item"><span className="p-dot"></span> Beta_Tester</div>
                                    <div className="p-item pulse"><span className="p-dot"></span> Joining...</div>
                                </div>
                                <div className="lobby-status">
                                    <span className="status-indicator online"></span>
                                    Waiting for Host to start...
                                </div>
                            </div>
                        </div>

                        <div className="workflow-info-card">
                            <div className="info-icon">📡</div>
                            <h4>Real-time Synchronization</h4>
                            <p>Challenge friends or colleagues in live synchronized sessions with real-time leaderboards.</p>
                            <div className="info-actions">
                                <button className="mini-btn" onClick={() => navigate('/live-quiz/join')}>Join Room</button>
                                <button className="mini-btn primary" onClick={() => navigate('/live-quiz/create')}>Create Room</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="workflow-arrow-down long"></div>

                {/* Step 3: Quiz Session */}
                <div className="workflow-section session-section animated-fade-in" style={{ animationDelay: '0.35s' }}>
                    <h2 className="section-title">Step 3: Interactive Session</h2>

                    <div className="session-demo">
                        <div className="glass-card question-card">
                            <div className="question-header">
                                <div className="question-meta">
                                    <span className="question-number">Question 1/20</span>
                                    <span className="mode-badge timed">
                                        <span className="timer-icon">⏱️</span>
                                        TIMED MODE
                                    </span>
                                </div>
                                <div className="timer-display pulse">
                                    <span>09:58</span>
                                </div>
                            </div>

                            <div className="question-content">
                                <h3>How does Javascript handle asynchronous operations?</h3>

                                <div className="quiz-options">
                                    <div className="option-item">
                                        <div className="option-radio">A</div>
                                        <span>Through multi-threading only</span>
                                    </div>
                                    <div className="option-item selected">
                                        <div className="option-radio selected">B</div>
                                        <span>Event Loop and Callback Queue</span>
                                    </div>
                                    <div className="option-item">
                                        <div className="option-radio">C</div>
                                        <span>Strict sequential execution</span>
                                    </div>
                                </div>

                                <button className="submit-btn">
                                    Submit & Continue
                                </button>
                            </div>
                        </div>

                        <div className="session-note">
                            <span className="note-arrow">↓</span>
                            <span>Live Progress Tracking, Real-time Leaderboards & Anti-Cheat Monitoring</span>
                        </div>
                    </div>
                </div>

                <div className="workflow-arrow-down long"></div>

                {/* Results & Analytics */}
                <div className="workflow-section results-section animated-fade-in" style={{ animationDelay: '0.5s' }}>
                    <h2 className="section-title">Step 4: Intelligence & Analytics</h2>

                    <div className="results-demo">
                        <div className="glass-card results-card">
                            <div className="score-display">
                                <div className="score-circle">
                                    <svg className="score-ring-container" width="150" height="150">
                                        <circle cx="75" cy="75" r="65" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                        <circle className="score-ring" cx="75" cy="75" r="65" fill="transparent" stroke="#00E5FF" strokeWidth="8" strokeLinecap="round" />
                                    </svg>
                                    <div className="score-content">
                                        <div className="score-value">85%</div>
                                        <div className="score-label">Accuracy</div>
                                    </div>
                                </div>
                                <div className="score-message">
                                    <h3>Excellent Progress!</h3>
                                    <div className="score-stats">
                                        <div className="stat">Mastered: <strong>Event Loop</strong></div>
                                        <div className="stat">Weakness: <strong>Prototypes</strong></div>
                                        <div className="stat" style={{ color: '#00E5FF', cursor: 'pointer' }}>Review Full Report →</div>
                                    </div>
                                </div>
                            </div>

                            <div className="analytics-charts">
                                <div className="chart-card">
                                    <h4>TOPIC STRENGTHS</h4>
                                    <div className="bar-chart">
                                        <div className="bar" style={{ height: '70%' }}></div>
                                        <div className="bar" style={{ height: '85%' }}></div>
                                        <div className="bar" style={{ height: '55%' }}></div>
                                        <div className="bar" style={{ height: '90%' }}></div>
                                    </div>
                                </div>
                                <div className="chart-card">
                                    <h4>TIME DISRIBUTION</h4>
                                    <div className="line-chart">
                                        <svg viewBox="0 0 200 100" className="chart-svg">
                                            <polyline
                                                points="0,80 40,65 80,70 120,45 160,55 200,40"
                                                className="chart-line"
                                                fill="transparent"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="workflow-cta animated-fade-in" style={{ animationDelay: '0.7s' }}>
                <div className="cta-content">
                    <h2>Unleash Your Potential</h2>
                    <p>Start your personalized learning journey with AI today.</p>
                    <div className="cta-buttons">
                        <button className="cta-button primary" onClick={() => navigate('/take-quiz')}>
                            🚀 Get Started
                        </button>
                        <button className="cta-button secondary" onClick={() => navigate('/dashboard')}>
                            📊 My Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizWorkflow;

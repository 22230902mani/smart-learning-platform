import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [readiness, setReadiness] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [analyticsRes, readinessRes] = await Promise.all([
                analyticsAPI.getStudentAnalytics(),
                analyticsAPI.getReadinessScore()
            ]);

            setAnalytics(analyticsRes.data.data);
            setReadiness(readinessRes.data.data);
        } catch (error) {
            console.error('Dashboard data fetch error:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
            } else {
                const errorMessage = error.response?.data?.message || 'Failed to load dashboard data';
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <div className="spinner" />
                </div>
            </div>
        );
    }

    const getScoreColor = (score) => {
        if (score >= 75) return '#10b981';
        if (score >= 50) return '#f59e0b';
        return '#ef4444';
    };

    const getScoreLabel = (score) => {
        if (score >= 75) return 'Excellent';
        if (score >= 50) return 'Good';
        return 'Needs Improvement';
    };

    const getLearnUrl = (subject, topic) => {
        const s = (subject || '').trim().toLowerCase();
        const t = (topic || '').trim().toLowerCase();

        // Map common subjects to their W3Schools paths/prefixes
        const urlMap = {
            'c++': 'cpp',
            'c': 'c',
            'java': 'java',
            'python': 'python',
            'javascript': 'js',
            'react': 'react',
            'node.js': 'nodejs',
            'html': 'html',
            'css': 'css',
            'sql': 'sql',
            'mongodb': 'mongodb',
            'php': 'php',
            'angular': 'angular',
            'vue.js': 'vue',
            'go': 'go',
            'kotlin': 'kotlin',
            'r': 'r',
            'swift': 'swift',
            'ruby': 'ruby',
            'dsa': 'dsa',
            'dbms': 'sql',
            'machine learning': 'python/python_ml_getting_started.asp',
            'data science': 'datascience'
        };

        // If we have both subject and topic, search directly on W3Schools for the specific topic
        if (s && t) {
            return `https://www.w3schools.com/googlesearch?q=${encodeURIComponent(s + ' ' + t)}`;
        }

        // If only subject is available, go to its home page
        if (urlMap[s]) {
            const path = urlMap[s];
            return path.includes('.asp') ? `https://www.w3schools.com/${path}` : `https://www.w3schools.com/${path}/`;
        }

        // Absolute fallback for unknown subjects/topics
        return `https://www.google.com/search?q=site:w3schools.com+${encodeURIComponent(subject || '')}+${encodeURIComponent(topic || '')}`;
    };

    return (
        <div className="dashboard-container">
            {/* Announcement Ticker */}
            <div className="announcement-ticker">
                <span className="ticker-label">Breaking News</span>
                <div className="ticker-content">
                    <span>📢 Registration open for National Digital Literacy Quiz 2026.</span>
                    <span>🏆 Top 10 performers will receive official certification from the Ministry.</span>
                    <span>🚀 New AI topics added: Large Language Models and Neural Networks.</span>
                    <span>📍 Upcoming Live Battle: Full Stack Development - Saturday, 8:00 PM.</span>
                </div>
            </div>

            {/* Amazon-style Quick Access Categories for Mobile */}

            <div className="quick-access-scroll">
                <Link to="/quiz?subject=AI Fundamentals" className="quick-access-item">
                    <div className="quick-icon-circle">🤖</div>
                    <span>AI Basics</span>
                </Link>
                <Link to="/quiz?subject=Cyber Security" className="quick-access-item">
                    <div className="quick-icon-circle">🔒</div>
                    <span>Security</span>
                </Link>
                <Link to="/quiz?subject=Cloud Computing" className="quick-access-item">
                    <div className="quick-icon-circle">☁️</div>
                    <span>Cloud</span>
                </Link>
                <Link to="/quiz?subject=Full Stack Mastery" className="quick-access-item">
                    <div className="quick-icon-circle">💻</div>
                    <span>Frontend</span>
                </Link>
                <Link to="/quiz?subject=Python Engine" className="quick-access-item">
                    <div className="quick-icon-circle">🐍</div>
                    <span>Python</span>
                </Link>
                <Link to="/quiz?subject=DSA Concepts" className="quick-access-item">
                    <div className="quick-icon-circle">📊</div>
                    <span>Algorithms</span>
                </Link>
            </div>


            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Welcome back, {user?.name}</h1>
                    <p className="dashboard-subtitle">Empowering your future through digital excellence.</p>
                </div>
                <div className="header-actions">
                    <Link to="/quiz" className="btn btn-primary">
                        🚀 Take New Quiz
                    </Link>
                </div>
            </div>

            {/* Participation Banner */}
            <div className="participation-banner">
                <div className="participant-count">
                    <span className="count-number">5,14,286</span>
                    <span className="count-label">Students Online</span>
                </div>
                <div className="participant-count">
                    <span className="count-number">12,482</span>
                    <span className="count-label">Quizzes Today</span>
                </div>
                <div className="participant-count">
                    <span className="count-number">98%</span>
                    <span className="count-label">Satisfaction Rate</span>
                </div>
            </div>

            {/* Top Section: Readiness Card + Stats */}
            <div className="dashboard-grid">
                {/* Left Column: Readiness Card */}
                {readiness && (
                    <div className="readiness-card">
                        <div className="readiness-content">
                            <div className="readiness-info">
                                <span className="score-label">Global Readiness Score</span>
                                <div className="score-value">{Math.round(readiness.interviewReadinessScore)}%</div>
                                <div className="score-breakdown">
                                    <h3>{getScoreLabel(readiness.interviewReadinessScore)}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>National Rank: #1,245 | Percentile: 92%</p>
                                </div>
                            </div>

                            <div className="score-circle">
                                <div className="score-inner">
                                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#00e5ff' }}>ISO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Right Column: Key Stats */}
                <div className="stats-column">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ fontSize: '1rem', fontWeight: 800 }}>Σ</div>
                        <div className="stat-content">
                            <h3>{analytics?.overview?.totalAttempts || 0}</h3>
                            <p>Total Attempts</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ fontSize: '1rem', fontWeight: 800 }}>✓</div>
                        <div className="stat-content">
                            <h3>{analytics?.overview?.correctAttempts || 0}</h3>
                            <p>Correct</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ fontSize: '1rem', fontWeight: 800 }}>✕</div>
                        <div className="stat-content">
                            <h3>{(analytics?.overview?.totalAttempts || 0) - (analytics?.overview?.correctAttempts || 0)}</h3>
                            <p>Incorrect</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ fontSize: '1rem', fontWeight: 800 }}>%</div>
                        <div className="stat-content">
                            <h3>{Math.round(analytics?.overview?.overallAccuracy || 0)}%</h3>
                            <p>Mastery</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Official Assessment Pathways Section */}
            <div className="featured-assessments">
                <div className="section-header">
                    <h3 className="topic-performance-heading" style={{ margin: 0 }}>Official Assessment Pathways</h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>Industry-standard evaluations curated for mid-to-senior technical roles.</p>
                </div>
                <div className="assessment-grid" style={{ marginTop: '2rem' }}>
                    <div className="assessment-card">
                        <div className="assessment-image" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
                            <span className="assessment-badge">Standard</span>
                            <h3>Data Privacy & Ethics</h3>
                        </div>
                        <div className="assessment-info">
                            <h4>Compliance Frameworks</h4>
                            <p>An in-depth review of GDPR, CCPA, and ethical data governance for modern engineering.</p>
                            <div className="status-row">
                                <span className="status-badge"><span className="dot"></span> Verified</span>
                                <span>15 Mins</span>
                            </div>
                            <Link to="/quiz?subject=Data Privacy %26 Ethics&auto=true" className="btn-play-link">
                                <button className="btn-play">Begin Assessment</button>
                            </Link>
                        </div>
                    </div>

                    <div className="assessment-card">
                        <div className="assessment-image" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
                            <span className="assessment-badge">Advanced</span>
                            <h3>AI Fundamentals</h3>
                        </div>
                        <div className="assessment-info">
                            <h4>Machine Intelligence</h4>
                            <p>Assess your knowledge of neural architectures, LLM fine-tuning, and algorithmic bias.</p>
                            <div className="status-row">
                                <span className="status-badge"><span className="dot"></span> Active</span>
                                <span>20 Mins</span>
                            </div>
                            <Link to="/quiz?subject=AI Fundamentals&auto=true" className="btn-play-link">
                                <button className="btn-play">Begin Assessment</button>
                            </Link>
                        </div>
                    </div>

                    <div className="assessment-card">
                        <div className="assessment-image" style={{ background: 'linear-gradient(135deg, #450a0a, #7f1d1d)' }}>
                            <h3>Cyber Security</h3>
                        </div>
                        <div className="assessment-info">
                            <h4>Infrastructure Security</h4>
                            <p>Practical evaluation of penetration testing principles and defensive systems architecture.</p>
                            <div className="status-row">
                                <span className="status-badge"><span className="dot"></span> Online</span>
                                <span>25 Mins</span>
                            </div>
                            <Link to="/quiz?subject=Cyber Security&auto=true" className="btn-play-link">
                                <button className="btn-play">Begin Assessment</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Technology Section */}
            <div className="featured-assessments" style={{ marginTop: '3.5rem' }}>
                <div className="section-header">
                    <h3 className="topic-performance-heading" style={{ margin: 0 }}>Strategic Technology</h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>High-velocity domains driving global digital transformation.</p>
                </div>
                <div className="assessment-grid" style={{ marginTop: '2rem' }}>
                    <div className="assessment-card">
                        <div className="assessment-image" style={{ background: 'linear-gradient(135deg, #0c4a6e, #075985)' }}>
                            <span className="assessment-badge">Priority</span>
                            <h3>Cloud Computing</h3>
                        </div>
                        <div className="assessment-info">
                            <h4>Cloud Architecture</h4>
                            <p>Master multi-cloud strategy, serverless orchestration, and disaster recovery patterns.</p>
                            <div className="status-row">
                                <span className="status-badge"><span className="dot" style={{ background: '#10b981' }}></span> Trending</span>
                                <span>30 Mins</span>
                            </div>
                            <Link to="/quiz?subject=Cloud Computing&auto=true" className="btn-play-link">
                                <button className="btn-play">Begin Assessment</button>
                            </Link>
                        </div>
                    </div>

                    <div className="assessment-card">
                        <div className="assessment-image" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
                            <h3>DevOps & Infra</h3>
                        </div>
                        <div className="assessment-info">
                            <h4>Site Reliability</h4>
                            <p>Evaluate CI/CD automation, container orchestration, and infrastructure-as-code proficiency.</p>
                            <div className="status-row">
                                <span className="status-badge"><span className="dot"></span> Pro Level</span>
                                <span>25 Mins</span>
                            </div>
                            <Link to="/quiz?subject=DevOps&auto=true" className="btn-play-link">
                                <button className="btn-play">Begin Assessment</button>
                            </Link>
                        </div>
                    </div>

                    <div className="assessment-card">
                        <div className="assessment-image" style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)' }}>
                            <h3>Full Stack Mastery</h3>
                        </div>
                        <div className="assessment-info">
                            <h4>Systems Integration</h4>
                            <p>Total stack proficiency from persistent storage layers to low-latency frontend state.</p>
                            <div className="status-row">
                                <span className="status-badge"><span className="dot" style={{ background: '#3b82f6' }}></span> Tier 1</span>
                                <span>40 Mins</span>
                            </div>
                            <Link to="/quiz?subject=MERN Stack&auto=true" className="btn-play-link">
                                <button className="btn-play">Begin Assessment</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core CS Foundations Section */}
            <div className="featured-assessments" style={{ marginTop: '3.5rem' }}>
                <div className="section-header">
                    <h3 className="topic-performance-heading" style={{ margin: 0 }}>Core CS Foundations</h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>Fundamental knowledge required for elite technical engineering.</p>
                </div>
                <div className="assessment-grid" style={{ marginTop: '2rem' }}>
                    <div className="assessment-card">
                        <div className="assessment-image" style={{ background: 'linear-gradient(135deg, #451a03, #78350f)' }}>
                            <span className="assessment-badge">Core</span>
                            <h3>DSA Concepts</h3>
                        </div>
                        <div className="assessment-info">
                            <h4>Algorithmic Theory</h4>
                            <p>Graph theory, dynamic programming, and asymptotic analysis for complex problem solving.</p>
                            <div className="status-row">
                                <span className="status-badge"><span className="dot" style={{ background: '#f59e0b' }}></span> Required</span>
                                <span>45 Mins</span>
                            </div>
                            <Link to="/quiz?subject=DSA&auto=true" className="btn-play-link">
                                <button className="btn-play">Begin Assessment</button>
                            </Link>
                        </div>
                    </div>

                    <div className="assessment-card">
                        <div className="assessment-image" style={{ background: 'linear-gradient(135deg, #1e3a8a, #1e40af)' }}>
                            <h3>Python Engine</h3>
                        </div>
                        <div className="assessment-info">
                            <h4>Language Internals</h4>
                            <p>Memory management, concurrency patterns, and optimized data processing in Python.</p>
                            <div className="status-row">
                                <span className="status-badge"><span className="dot"></span> Optimized</span>
                                <span>20 Mins</span>
                            </div>
                            <Link to="/quiz?subject=Python&auto=true" className="btn-play-link">
                                <button className="btn-play">Begin Assessment</button>
                            </Link>
                        </div>
                    </div>

                    <div className="assessment-card">
                        <div className="assessment-image" style={{ background: 'linear-gradient(135deg, #4c0519, #881337)' }}>
                            <h3>Java Systems</h3>
                        </div>
                        <div className="assessment-info">
                            <h4>Enterprise Design</h4>
                            <p>JVM performance tuning, multithreading, and architectural patterns for large-scale Java.</p>
                            <div className="status-row">
                                <span className="status-badge"><span className="dot" style={{ background: '#ef4444' }}></span> Robust</span>
                                <span>30 Mins</span>
                            </div>
                            <Link to="/quiz?subject=Java&auto=true" className="btn-play-link">
                                <button className="btn-play">Begin Assessment</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specialized Engineering Section */}
            <div className="featured-assessments" style={{ marginTop: '3.5rem' }}>
                <div className="section-header">
                    <h3 className="topic-performance-heading" style={{ margin: 0 }}>Specialized Engineering</h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>Focused domains for high-performance application development.</p>
                </div>
                <div className="assessment-grid" style={{ marginTop: '2rem' }}>
                    <div className="assessment-card">
                        <div className="assessment-image" style={{ background: 'linear-gradient(135deg, #164e63, #155e75)' }}>
                            <span className="assessment-badge">Specialized</span>
                            <h3>React Lifecycle</h3>
                        </div>
                        <div className="assessment-info">
                            <h4>Frontend Architecture</h4>
                            <p>Performance optimization, complex state reconciliation, and modern reactive patterns.</p>
                            <div className="status-row">
                                <span className="status-badge"><span className="dot" style={{ background: '#06b6d4' }}></span> Interface</span>
                                <span>25 Mins</span>
                            </div>
                            <Link to="/quiz?subject=React&auto=true" className="btn-play-link">
                                <button className="btn-play">Begin Assessment</button>
                            </Link>
                        </div>
                    </div>

                    <div className="assessment-card">
                        <div className="assessment-image" style={{ background: 'linear-gradient(135deg, #2e1065, #4c1d95)' }}>
                            <h3>Node.js Runtimes</h3>
                        </div>
                        <div className="assessment-info">
                            <h4>Backend Execution</h4>
                            <p>Event-driven architecture, binary stream handling, and secure API surface design.</p>
                            <div className="status-row">
                                <span className="status-badge"><span className="dot"></span> Scalable</span>
                                <span>25 Mins</span>
                            </div>
                            <Link to="/quiz?subject=Node.js&auto=true" className="btn-play-link">
                                <button className="btn-play">Begin Assessment</button>
                            </Link>
                        </div>
                    </div>

                    <div className="assessment-card">
                        <div className="assessment-image" style={{ background: 'linear-gradient(135deg, #334155, #475569)' }}>
                            <h3>Database Theory</h3>
                        </div>
                        <div className="assessment-info">
                            <h4>Persistent Storage</h4>
                            <p>Relational calculus, transaction isolation levels, and high-performance indexing strategies.</p>
                            <div className="status-row">
                                <span className="status-badge"><span className="dot" style={{ background: '#3b82f6' }}></span> Foundation</span>
                                <span>20 Mins</span>
                            </div>
                            <Link to="/quiz?subject=SQL&auto=true" className="btn-play-link">
                                <button className="btn-play">Begin Assessment</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Topic Analysis */}
            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {/* Weak Topics */}
                <div className="dashboard-card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h2 className="card-title" style={{ marginBottom: 0 }}>⚠️ Your Improvement Areas</h2>
                        <Link to="/analytics">Full Report</Link>
                    </div>

                    {analytics?.topicStats?.weak?.length > 0 ? (
                        <div className="topic-list">
                            {analytics.topicStats.weak.slice(0, 5).map((topic, index) => (
                                <div key={index} className="topic-item weak-topic-item">
                                    <div className="topic-info">
                                        <h4>{topic.topicId?.concept || 'Unknown Topic'}</h4>
                                        <span className="topic-subject">{topic.topicId?.subject}</span>
                                    </div>
                                    <div className="topic-actions">
                                        <span className="mastery-score">
                                            {Math.round(topic.masteryScore)}%
                                        </span>
                                        <a
                                            href={getLearnUrl(topic.topicId?.subject, topic.topicId?.concept)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="learn-link-btn"
                                        >
                                            📖 Study
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">No weak topics. You are doing great! 🎉</p>
                    )}
                </div>

                {/* Strong Topics */}
                <div className="dashboard-card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h2 className="card-title" style={{ marginBottom: 0 }}>💪 Certified Strengths</h2>
                    </div>

                    {analytics?.topicStats?.strong?.length > 0 ? (
                        <div className="topic-list">
                            {analytics.topicStats.strong.slice(0, 5).map((topic, index) => (
                                <div key={index} className="topic-item">
                                    <div className="topic-info">
                                        <h4>{topic.topicId?.concept || 'Unknown Topic'}</h4>
                                        <span className="topic-subject">{topic.topicId?.subject}</span>
                                    </div>
                                    <span className="mastery-score">
                                        {Math.round(topic.masteryScore)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">Keep practicing to build knowledge!</p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Dashboard;

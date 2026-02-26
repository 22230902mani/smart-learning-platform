import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="landing-container">
            {/* Navbar */}
            <nav className="landing-nav">
                <div className="landing-logo">
                    <span className="logo-emoji">🧠</span>
                    <span className="logo-text">SmartPrep AI</span>
                </div>
                <div className="nav-links">
                    <Link to="/login" className="nav-btn-login">Sign In</Link>
                    <Link to="/register" className="nav-btn-register">Join Free</Link>
                </div>
            </nav>

            {/* Announcement Ticker */}
            <div className="landing-ticker">
                <div className="ticker-label">LATEST UPDATES</div>
                <marquee className="ticker-text">
                    🇮🇳 National Level Skill Assessment 2026 starts in 10 days! | Certifications for all participants | Join the Social & Live Battles today! | Next Webinar on AI Ethics: Monday 10 AM.
                </marquee>
            </div>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Empowering Citizens through <span className="gradient-text">AI Education</span>
                    </h1>
                    <p className="hero-subtitle">
                        An official initiative for adaptive learning, identifying skill gaps, and building a future-ready digital workforce.
                    </p>
                    <div className="hero-cta">
                        <Link to="/register" className="cta-btn-primary">Get Started Now</Link>
                        <Link to="/login" className="cta-btn-secondary">Platform Tour</Link>
                    </div>

                    <div className="national-stats">
                        <div className="n-stat">
                            <span className="n-val">2.5M+</span>
                            <span className="n-lab">Learners</span>
                        </div>
                        <div className="n-stat">
                            <span className="n-val">500+</span>
                            <span className="n-lab">Institutions</span>
                        </div>
                        <div className="n-stat">
                            <span className="n-val">15M+</span>
                            <span className="n-lab">Assessments</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="floating-card c1">
                        <div className="card-icon">🎖️</div>
                        <div className="card-text">
                            <h4>Certified</h4>
                            <p>Ministry Verified</p>
                        </div>
                    </div>
                    <div className="floating-card c2">
                        <div className="card-icon">📈</div>
                        <div className="card-text">
                            <h4>Progress</h4>
                            <p>Skill Gap Tracking</p>
                        </div>
                    </div>
                    <div className="main-visual-orb"></div>
                </div>
            </header>

            {/* Features Grid */}
            <section className="features-section">
                <h2 className="section-title">Engineered for Excellence</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="f-icon">📊</div>
                        <h3>Deep Analytics</h3>
                        <p>Visualize your progress with institutional-grade data tracking and improvement scores.</p>
                    </div>
                    <div className="feature-card">
                        <div className="f-icon">🧩</div>
                        <h3>Adaptive Engine</h3>
                        <p>Our AI adjusts question difficulty in real-time based on your current performance and confidence.</p>
                    </div>
                    <div className="feature-card">
                        <div className="f-icon">🔍</div>
                        <h3>Weak Spot Detection</h3>
                        <p>Stop wasting time on what you already know. We highlight exactly where you need to focus.</p>
                    </div>
                    <div className="feature-card">
                        <div className="f-icon">⚔️</div>
                        <h3>Live Challenges</h3>
                        <p>Join live quiz sessions and compete with other students to test your knowledge under pressure.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <p>© 2026 SmartPrep AI Platform. All rights reserved.</p>
                    <div className="footer-links">
                        <a href="#privacy">Privacy</a>
                        <a href="#terms">Terms</a>
                        <a href="#contact">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

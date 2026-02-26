import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
    const [isLiveMenuOpen, setIsLiveMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleLiveMenu = (e) => {
        e.preventDefault();
        setIsLiveMenuOpen(!isLiveMenuOpen);
    };

    const handleSubLinkClick = (path) => {
        setIsLiveMenuOpen(false);
        navigate(path);
    };

    return (
        <>
            {/* Live Quiz Sub-Menu Overlay */}
            <div className={`bottom-nav-overlay ${isLiveMenuOpen ? 'show' : ''}`} onClick={() => setIsLiveMenuOpen(false)}>
                <div className="live-quiz-sheet" onClick={(e) => e.stopPropagation()}>
                    <div className="sheet-header">
                        <div className="sheet-indicator"></div>
                        <h3>Live Quiz Control</h3>
                    </div>
                    <div className="sheet-grid">
                        <div className="sheet-item" onClick={() => handleSubLinkClick('/live-quiz/create')}>
                            <span className="sheet-icon">➕</span>
                            <span>Create</span>
                        </div>
                        <div className="sheet-item" onClick={() => handleSubLinkClick('/live-quiz/join')}>
                            <span className="sheet-icon">🎮</span>
                            <span>Join</span>
                        </div>
                        <div className="sheet-item" onClick={() => handleSubLinkClick('/live-quiz/active')}>
                            <span className="sheet-icon">📡</span>
                            <span>Live Dash</span>
                        </div>
                        <div className="sheet-item" onClick={() => handleSubLinkClick('/live-quiz/history')}>
                            <span className="sheet-icon">📜</span>
                            <span>History</span>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="bottom-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">🏠</span>
                    <span className="nav-label">Home</span>
                </NavLink>
                <NavLink to="/quiz" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">📝</span>
                    <span className="nav-label">Quiz</span>
                </NavLink>
                <NavLink to="/results" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">📊</span>
                    <span className="nav-label">Results</span>
                </NavLink>

                {/* Special Live Quiz Toggle */}
                <div
                    className={`bottom-nav-item ${isLiveMenuOpen || location.pathname.startsWith('/live-quiz') ? 'active' : ''} live-toggle`}
                    onClick={toggleLiveMenu}
                >
                    <div className="live-icon-wrapper">
                        <span className="nav-icon">📡</span>
                    </div>
                    <span className="nav-label">Live</span>
                </div>

                <NavLink to="/analytics" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">📈</span>
                    <span className="nav-label">Stats</span>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">👤</span>
                    <span className="nav-label">Profile</span>
                </NavLink>
            </nav>
        </>
    );
};

export default BottomNav;

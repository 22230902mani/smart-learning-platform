import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="brand-logo">
                    <span className="logo-icon">🧠</span>
                    <span className="logo-text">SmartPrep AI</span>
                </div>
            </div>

            <div className="sidebar-content">
                <div className="sidebar-section">
                    <h4 className="sidebar-section-title">GENERAL</h4>
                    <nav className="sidebar-nav">
                        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">📊</span>
                            Overview
                        </NavLink>
                        <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">📈</span>
                            Analytics
                        </NavLink>
                        <NavLink to="/workflow" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">🔄</span>
                            Workflow
                        </NavLink>
                        <NavLink to="/quiz" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">📝</span>
                            Take Quiz
                        </NavLink>
                        <NavLink to="/results" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">📊</span>
                            Results
                        </NavLink>
                    </nav>
                </div>

                <div className="sidebar-section">
                    <h4 className="sidebar-section-title">LIVE QUIZ</h4>
                    <nav className="sidebar-nav">
                        <NavLink to="/live-quiz/create" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">➕</span>
                            Create Quiz
                        </NavLink>
                        <NavLink to="/live-quiz/join" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">🎮</span>
                            Join Quiz
                        </NavLink>
                        <NavLink to="/live-quiz/active" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">📡</span>
                            Live Dashboard
                        </NavLink>
                        <NavLink to="/live-quiz/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">📜</span>
                            Quiz History
                        </NavLink>
                    </nav>
                </div>

                <div className="sidebar-section">
                    <h4 className="sidebar-section-title">SUPPORT</h4>
                    <nav className="sidebar-nav">
                        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">👤</span>
                            Profile
                        </NavLink>
                        <button onClick={handleLogout} className="nav-item logout-btn">
                            <span className="nav-icon">🚪</span>
                            Logout
                        </button>
                    </nav>
                </div>
            </div>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                    <div className="user-details">
                        <span className="user-name">{user?.name}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

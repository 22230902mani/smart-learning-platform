import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    <div className="brand-icon">🧠</div>
                    <span className="brand-text">SmartPrep AI</span>
                </Link>

                <button
                    className="navbar-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                    <div className="navbar-nav">
                        <NavLink to="/dashboard" className="nav-link">
                            Dashboard
                        </NavLink>
                        <NavLink to="/workflow" className="nav-link">
                            📊 Workflow
                        </NavLink>
                        <NavLink to="/quiz" className="nav-link">
                            Take Quiz
                        </NavLink>
                        <NavLink to="/analytics" className="nav-link">
                            Analytics
                        </NavLink>
                        {user?.role === 'admin' && (
                            <NavLink to="/admin" className="nav-link">
                                Admin Panel
                            </NavLink>
                        )}
                    </div>

                    <div className="navbar-actions">
                        <NavLink to="/profile" className="nav-link profile-link">
                            <div className="user-avatar">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="user-name">{user?.name}</span>
                        </NavLink>
                        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

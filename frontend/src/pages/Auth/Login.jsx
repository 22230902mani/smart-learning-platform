import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            {/* 
                LOGIN LAYOUT: 
                Left = Form (Black) 
                Right = Welcome (Blue)
            */}
            <div className="auth-card login-layout">

                {/* FORM SECTION (Left) */}
                <div className="auth-form-section">
                    <h2 className="auth-title">Login</h2>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Username</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <span className="input-icon">👤</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span className="input-icon">🔒</span>
                        </div>

                        <button
                            type="submit"
                            className="btn-block"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                            <p className="auth-subtitle" style={{ margin: 0 }}>
                                Don't have an account? <Link to="/register">Sign Up</Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* WELCOME SECTION (Right) */}
                <div className="auth-welcome-section">
                    <h1 className="welcome-text">WELCOME<br />BACK!</h1>
                    <p className="welcome-subtext" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        We're glad to see you again!
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;

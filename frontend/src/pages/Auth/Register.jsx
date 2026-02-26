import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const result = await register(formData.name, formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            {/* 
                REGISTER LAYOUT: 
                Left = Welcome (Blue) 
                Right = Form (Black)
            */}
            <div className="auth-card register-layout">

                {/* WELCOME SECTION (Left) */}
                <div className="auth-welcome-section">
                    <h1 className="welcome-text">WELCOME!</h1>
                    <p className="welcome-subtext" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Join the future of learning today.
                    </p>
                </div>

                {/* FORM SECTION (Right) */}
                <div className="auth-form-section">
                    <h2 className="auth-title">Register</h2>

                    {error && <div className="alert alert-error" style={{ marginBottom: '1rem', color: '#ff4d4f', textAlign: 'center' }}>{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Username</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                placeholder="Create a username"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <span className="input-icon">👤</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email</label>
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
                            <span className="input-icon">✉️</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span className="input-icon">🔒</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
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
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>

                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <p className="auth-subtitle" style={{ margin: 0 }}>
                                Already have an account? <Link to="/login">Sign In</Link>
                            </p>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Register;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login, register, isAuthenticated } = useAuth();

    // State
    const [isLoginMode, setIsLoginMode] = useState(location.pathname === '/login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form Data
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

    // Sync URL with State & Redirect if Authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
        setIsLoginMode(location.pathname === '/login');
    }, [location.pathname, isAuthenticated, navigate]);

    // Handlers
    const handleSwitch = (mode) => {
        if ((mode === 'login' && isLoginMode) || (mode === 'register' && !isLoginMode)) return;
        setError(''); // Clear error when switching modes

        if (mode === 'login') {
            navigate('/login');
        } else {
            navigate('/register');
        }
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    // Submit Login
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(loginData.email, loginData.password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Access Denied: Invalid Credentials.');
        }
        setLoading(false);
    };

    // Submit Register
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (registerData.password !== registerData.confirmPassword) {
            return setError('Passwords do not match');
        }
        if (registerData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        const result = await register(registerData.name, registerData.email, registerData.password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Registration failed.');
        }
        setLoading(false);
    };

    return (
        <div className={`auth-page-container ${isLoginMode ? 'login-active' : 'register-active'}`}>
            <div className="auth-box">
                <button onClick={() => navigate('/')} className="back-home-btn">
                    <span className="back-icon">←</span>
                    <span className="back-text">Back to Home</span>
                </button>
                <div className="diagonal-overlay"></div>

                {/* LOGIN FORM SECTION */}
                <div className={`auth-panel login-panel ${isLoginMode ? 'active' : 'inactive'}`}>
                    <div className="panel-content">
                        <h1 className="auth-title glitch-text" data-text="LOGIN">LOGIN</h1>
                        <p className="auth-subtitle">Welcome back, Commander.</p>

                        {error && isLoginMode && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleLoginSubmit} className="auth-form">
                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder=" "
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                    required
                                />
                                <label>Email Address</label>
                                <span className="input-highlight"></span>
                            </div>

                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder=" "
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    required
                                />
                                <label>Password</label>
                                <span className="input-highlight"></span>
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>

                            <button type="submit" className="neon-btn cyan-btn" disabled={loading}>
                                {loading ? 'ACCESSING...' : 'INITIATE LOGIN'}
                            </button>
                        </form>

                        <div className="auth-switch-text">
                            New User? <span onClick={() => handleSwitch('register')}>Initialize Protocol</span>
                        </div>
                    </div>
                </div>

                {/* REGISTER FORM SECTION */}
                <div className={`auth-panel register-panel ${!isLoginMode ? 'active' : 'inactive'}`}>
                    <div className="panel-content">
                        <h1 className="auth-title glitch-text" data-text="REGISTER">REGISTER</h1>
                        <p className="auth-subtitle">Join the network.</p>

                        {error && !isLoginMode && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleRegisterSubmit} className="auth-form">
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder=" "
                                    value={registerData.name}
                                    onChange={handleRegisterChange}
                                    required
                                />
                                <label>Username</label>
                                <span className="input-highlight"></span>
                            </div>

                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder=" "
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    required
                                />
                                <label>Email Address</label>
                                <span className="input-highlight"></span>
                            </div>

                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder=" "
                                    value={registerData.password}
                                    onChange={handleRegisterChange}
                                    required
                                />
                                <label>Password</label>
                                <span className="input-highlight"></span>
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>

                            <div className="input-group">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder=" "
                                    value={registerData.confirmPassword}
                                    onChange={handleRegisterChange}
                                    required
                                />
                                <label>Confirm Password</label>
                                <span className="input-highlight"></span>
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>

                            <button type="submit" className="neon-btn purple-btn" disabled={loading}>
                                {loading ? 'REGISTERING...' : 'ESTABLISH LINK'}
                            </button>
                        </form>

                        <div className="auth-switch-text">
                            Already connected? <span onClick={() => handleSwitch('login')}>Access Account</span>
                        </div>
                    </div>
                </div>

                <div className="graphic-side-content">
                    <div className="graphic-text login-graphic">
                        <h2>SYSTEM<br />SECURE</h2>
                    </div>
                    <div className="graphic-text register-graphic">
                        <h2>FUTURE<br />AWAITS</h2>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;

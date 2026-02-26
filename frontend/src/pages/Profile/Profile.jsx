import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI, authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [analytics, setAnalytics] = useState(null);
    const [readiness, setReadiness] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfileStats();
    }, []);

    useEffect(() => {
        setError(''); // Clear error when tab changes
    }, [activeTab]);

    const fetchProfileStats = async () => {
        try {
            const [analyticsRes, readinessRes] = await Promise.all([
                analyticsAPI.getStudentAnalytics(),
                analyticsAPI.getReadinessScore()
            ]);
            setAnalytics(analyticsRes.data.data);
            setReadiness(readinessRes.data.data);
        } catch (error) {
            console.error('Failed to fetch profile stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Context-aware error clearing: only clear if the user is addressing the issue
        if (error) {
            if (name === 'currentPassword' && error.toLowerCase().includes('current')) setError('');
            if (name === 'newPassword' || name === 'confirmPassword') {
                if (error.toLowerCase().includes('match') || error.toLowerCase().includes('security')) setError('');
            }
        }
    };

    const isPasswordValid =
        formData.newPassword.length >= 8 &&
        /[A-Z]/.test(formData.newPassword) &&
        /[0-9]/.test(formData.newPassword);

    const handleSave = async (e) => {
        e.preventDefault();
        setError(''); // Initial clear for fresh attempt
        try {
            if (activeTab === 'profile') {
                await authAPI.updateProfile({
                    name: formData.name,
                    email: formData.email
                });
                toast.success('Profile updated successfully');
            } else {
                if (!isPasswordValid) {
                    setError('Awaiting security compliance: 8+ chars, upper, number.');
                    return;
                }
                if (formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
                    setError('Identity Verification Failure: Passwords match required.');
                    return;
                }
                await authAPI.changePassword({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                });
                toast.success('Security Protocol Updated. Re-authentication required.');
                setTimeout(() => {
                    localStorage.clear();
                    window.location.href = '/login';
                }, 2000);
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (error) {
            console.error('Protocol Update Failure:', error);
            const message = error.response?.data?.message || 'Update failed';
            setError(message);
            toast.error(message);
        }
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const getStatusLabel = (score) => {
        if (!score && score !== 0) return 'Pending';
        if (score >= 75) return 'Expert';
        if (score >= 50) return 'Active';
        return 'Novice';
    };

    const stats = [
        { label: 'Assessments', value: analytics?.overview?.totalAttempts || 0, icon: 'Σ' },
        { label: 'Accuracy', value: Math.round(analytics?.overview?.overallAccuracy || 0) + '%', icon: '%' },
        { label: 'Curriculum', value: analytics?.subjectPerformance?.length || 0, icon: 'Ω' },
        { label: 'Status', value: getStatusLabel(readiness?.interviewReadinessScore), icon: 'Δ' },
    ];

    if (loading) {
        return (
            <div className="profile-container">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                    <div className="spinner" />
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* ── Hero Banner ── */}
            <div className="profile-banner">
                <div className="profile-avatar-wrap">
                    <div className="profile-avatar">{initials}</div>
                    <div className="avatar-ring" />
                </div>
                <div className="profile-hero-info">
                    <h1 className="profile-name">{user?.name || 'User'}</h1>
                    <p className="profile-email">{user?.email || ''}</p>
                    <span className="profile-role-badge">{user?.role || 'Student'}</span>
                </div>
            </div>

            {/* ── Quick Stats ── */}
            <div className="profile-stats-row">
                {stats.map((s, i) => (
                    <div className="profile-stat-card" key={i}>
                        <span className="pstat-icon" style={{ fontSize: '0.9rem', fontWeight: 900 }}>{s.icon}</span>
                        <span className="pstat-value">{s.value}</span>
                        <span className="pstat-label">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* ── Tabs ── */}
            <div className="profile-tabs">
                {['profile', 'security'].map(tab => (
                    <button
                        key={tab}
                        className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'profile' ? 'Profile Details' : 'Identity Security'}
                    </button>
                ))}
            </div>

            {/* ── Forms ── */}
            <div className="profile-form-card">
                {activeTab === 'profile' && (
                    <form onSubmit={handleSave}>
                        <h2 className="form-section-title">Personal Information</h2>
                        <p className="form-section-sub">Update your display name and email address</p>

                        {error && <div className="auth-error" style={{ marginBottom: '2rem' }}>{error}</div>}

                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="profile-input"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="profile-input"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <input
                                type="text"
                                className="profile-input readonly"
                                value={user?.role || 'student'}
                                readOnly
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn">
                                {saved ? '✓ Saved!' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'security' && (
                    <form onSubmit={handleSave}>
                        <h2 className="form-section-title">Change Password</h2>
                        <p className="form-section-sub">Keep your account secure with a strong password</p>

                        {/* ── Security Validation Status ── */}
                        {(error || formData.newPassword || formData.currentPassword) && (
                            <div className="auth-error" style={{
                                marginBottom: '2.5rem',
                                borderLeft: error ? '4px solid #ef4444' : '4px solid #10b981',
                                background: error ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)'
                            }}>
                                <div style={{ fontWeight: 800, marginBottom: '0.4rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                    {error ? 'Security Conflict Identified' : 'Access Protocol Status'}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: error ? '#fca5a5' : '#a7f3d0' }}>
                                    {error || (isPasswordValid ? 'Protocol Secure: High-Entropy Match' : 'Awaiting Full Security Compliance...')}
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                className="profile-input"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                className="profile-input"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Min. 8 characters"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                className="profile-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repeat new password"
                                required
                            />
                        </div>

                        <div className="password-tips">
                            <div style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: '0.5rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Entropy Requirements</span>
                            </div>
                            <span className={formData.newPassword.length >= 8 ? 'tip ok' : 'tip'}>✓ At least 8 characters</span>
                            <span className={/[A-Z]/.test(formData.newPassword) ? 'tip ok' : 'tip'}>✓ Uppercase letter</span>
                            <span className={/[0-9]/.test(formData.newPassword) ? 'tip ok' : 'tip'}>✓ Number</span>
                            <span className={(formData.newPassword && formData.newPassword === formData.confirmPassword) ? 'tip ok' : 'tip'}>✓ Passwords must match</span>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={!isPasswordValid || formData.newPassword !== formData.confirmPassword}>
                                {saved ? '✓ Protocol Updated' : 'Initiate Security Update'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div >
    );
};

export default Profile;

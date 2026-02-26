import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import './Analytics.css';

const Analytics = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [readiness, setReadiness] = useState(null);
    const [weakTopics, setWeakTopics] = useState(null);
    const [attemptHistory, setAttemptHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTimeRange, setSelectedTimeRange] = useState('30');

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const [analyticsRes, readinessRes, weakTopicsRes, attemptsRes] = await Promise.all([
                analyticsAPI.getStudentAnalytics(),
                analyticsAPI.getReadinessScore(),
                analyticsAPI.getWeakTopics(),
                analyticsAPI.getAttemptHistory(null, { limit: 50 })
            ]);

            setAnalytics(analyticsRes.data.data);
            setReadiness(readinessRes.data.data);
            setWeakTopics(weakTopicsRes.data.data);
            setAttemptHistory(attemptsRes.data.data);
        } catch (error) {
            console.error('Analytics fetch error:', error);

            // Check if it's an authentication error
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
            } else if (error.response?.status === 404 || error.response?.data?.message?.includes('No data')) {
                toast.error('No analytics data yet. Take some quizzes to see your stats!');
            } else {
                toast.error('Failed to load analytics data');
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

    // Colors for charts — Solid Color palette
    const COLORS = {
        primary: '#F97316',  // Orange
        secondary: '#EA580C',  // Orange-dark
        success: '#84CC16',  // Lime Green
        warning: '#F59E0B',  // Amber
        danger: '#EF4444',  // Red
        info: '#3B82F6',   // Blue
        purple: '#A855F7',  // Purple
        pink: '#EC4899'    // Pink
    };

    const CHART_COLORS = ['#F97316', '#84CC16', '#A855F7', '#EC4899', '#EF4444', '#3B82F6', '#F59E0B', '#22C55E'];

    // Prepare performance trend data
    const performanceTrendData = analytics?.performanceTrend?.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        accuracy: parseFloat(item.accuracy.toFixed(1)),
        attempts: item.attempts
    })) || [];

    // Prepare topic mastery data for radar chart
    const topicMasteryData = analytics?.topicStats?.all?.slice(0, 6).map(topic => ({
        topic: topic.topicId?.concept?.substring(0, 15) || 'Unknown',
        mastery: parseFloat(topic.masteryScore.toFixed(1)),
        accuracy: parseFloat(topic.accuracy.toFixed(1))
    })) || [];

    // Prepare difficulty distribution
    const difficultyData = [
        { name: 'Easy', value: analytics?.overview?.totalAttempts ? Math.round(analytics.overview.totalAttempts * 0.3) : 0 },
        { name: 'Medium', value: analytics?.overview?.totalAttempts ? Math.round(analytics.overview.totalAttempts * 0.5) : 0 },
        { name: 'Hard', value: analytics?.overview?.totalAttempts ? Math.round(analytics.overview.totalAttempts * 0.2) : 0 }
    ];

    // Prepare subject distribution
    const subjectStats = {};
    analytics?.topicStats?.all?.forEach(topic => {
        const subject = topic.topicId?.subject || 'Other';
        if (!subjectStats[subject]) {
            subjectStats[subject] = { attempts: 0, accuracy: 0, count: 0 };
        }
        subjectStats[subject].attempts += topic.totalAttempts;
        subjectStats[subject].accuracy += topic.accuracy;
        subjectStats[subject].count += 1;
    });

    const subjectData = Object.entries(subjectStats).map(([subject, stats]) => ({
        subject,
        attempts: stats.attempts,
        avgAccuracy: parseFloat((stats.accuracy / stats.count).toFixed(1))
    }));

    // Prepare readiness score breakdown for pie chart
    const readinessBreakdownData = readiness?.scoreBreakdown ? [
        { name: 'Accuracy', value: parseFloat(readiness.scoreBreakdown.accuracy.score.toFixed(1)) },
        { name: 'Speed', value: parseFloat(readiness.scoreBreakdown.speedConsistency.score.toFixed(1)) },
        { name: 'Improvement', value: parseFloat(readiness.scoreBreakdown.improvementTrend.score.toFixed(1)) },
        { name: 'Confidence', value: parseFloat(readiness.scoreBreakdown.confidenceBehavior.score.toFixed(1)) }
    ] : [];

    const getScoreColor = (score) => {
        if (score >= 75) return COLORS.success;
        if (score >= 50) return COLORS.warning;
        return COLORS.danger;
    };

    const getLearnUrl = (subject, topic) => {
        const s = (subject || '').trim().toLowerCase();
        const t = (topic || '').trim().toLowerCase();

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
            'dbms': 'sql'
        };

        if (s && t) {
            return `https://www.w3schools.com/googlesearch?q=${encodeURIComponent(s + ' ' + t)}`;
        }

        const path = urlMap[s];
        if (path) {
            return `https://www.w3schools.com/${path}/`;
        }

        if (s === 'machine learning') return 'https://www.w3schools.com/python/python_ml_getting_started.asp';
        if (s === 'data science') return 'https://www.w3schools.com/datascience/';

        return `https://www.google.com/search?q=site:w3schools.com+${encodeURIComponent(subject || '')}+${encodeURIComponent(topic || '')}`;
    };

    return (
        <div className="container analytics-container">
            <div className="analytics-header">
                <div>
                    <h1 className="analytics-title">📊 Performance Analytics</h1>
                    <p className="analytics-subtitle">Detailed insights into your learning journey</p>
                </div>
                <div className="time-range-selector">
                    <button
                        className={`time-btn ${selectedTimeRange === '7' ? 'active' : ''}`}
                        onClick={() => setSelectedTimeRange('7')}
                    >
                        7 Days
                    </button>
                    <button
                        className={`time-btn ${selectedTimeRange === '30' ? 'active' : ''}`}
                        onClick={() => setSelectedTimeRange('30')}
                    >
                        30 Days
                    </button>
                    <button
                        className={`time-btn ${selectedTimeRange === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedTimeRange('all')}
                    >
                        All Time
                    </button>
                </div>
            </div>

            {/* Empty State - Show when no data */}
            {(!analytics || analytics?.overview?.totalAttempts === 0) && (
                <div className="empty-state-container">
                    <div className="empty-state-card">
                        <div className="empty-state-icon">📊</div>
                        <h2>No Analytics Data Yet</h2>
                        <p>Start taking quizzes to see your performance analytics and insights!</p>
                        <div className="empty-state-features">
                            <div className="empty-feature">
                                <span className="feature-icon">📈</span>
                                <span>Performance Trends</span>
                            </div>
                            <div className="empty-feature">
                                <span className="feature-icon">🎯</span>
                                <span>Topic Mastery</span>
                            </div>
                            <div className="empty-feature">
                                <span className="feature-icon">💡</span>
                                <span>Weak Topic Analysis</span>
                            </div>
                            <div className="empty-feature">
                                <span className="feature-icon">🏆</span>
                                <span>Readiness Score</span>
                            </div>
                        </div>
                        <a href="/quiz" className="btn btn-primary" style={{ marginTop: '2rem', textDecoration: 'none' }}>
                            Take Your First Quiz
                        </a>
                    </div>
                </div>
            )}

            {/* Show analytics only when data exists */}
            {analytics && analytics?.overview?.totalAttempts > 0 && (
                <>

                    <div className="analytics-stats-grid">
                        <div className="analytics-stat-card">
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#F97316' }}>
                                📝
                            </div>
                            <div className="stat-details">
                                <h3>{analytics?.overview?.totalAttempts || 0}</h3>
                                <p>Total Questions Attempted</p>
                                <span className="stat-change positive">+12% from last week</span>
                            </div>
                        </div>

                        <div className="analytics-stat-card">
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(132, 204, 22, 0.15)', color: '#84CC16' }}>
                                ✅
                            </div>
                            <div className="stat-details">
                                <h3>{analytics?.overview?.correctAttempts || 0}</h3>
                                <p>Correct Answers</p>
                                <span className="stat-change positive">+8% improvement</span>
                            </div>
                        </div>

                        <div className="analytics-stat-card">
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#A855F7' }}>
                                🎯
                            </div>
                            <div className="stat-details">
                                <h3>{analytics?.overview?.overallAccuracy || 0}%</h3>
                                <p>Overall Accuracy</p>
                                <span className={`stat-change ${parseFloat(analytics?.overview?.overallAccuracy || 0) > 70 ? 'positive' : 'negative'}`}>
                                    Target: 75%
                                </span>
                            </div>
                        </div>

                        <div className="analytics-stat-card">
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#EC4899' }}>
                                🏆
                            </div>
                            <div className="stat-details">
                                <h3>{Math.round(readiness?.interviewReadinessScore || 0)}</h3>
                                <p>Readiness Score</p>
                                <span className={`stat-change ${(readiness?.interviewReadinessScore || 0) > 70 ? 'positive' : 'negative'}`}>
                                    {(readiness?.interviewReadinessScore || 0) > 70 ? 'Interview Ready!' : 'Keep Practicing'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Performance Trend Chart */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <div>
                                <h2>📈 Performance Trend</h2>
                                <p>Your accuracy progression over time</p>
                            </div>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={performanceTrendData}>
                                    <defs>
                                        <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                                            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                    <XAxis dataKey="date" stroke="var(--text-secondary)" />
                                    <YAxis stroke="var(--text-secondary)" domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 22, 40, 0.95)',
                                            border: '1px solid rgba(0, 229, 255, 0.2)',
                                            borderRadius: '12px',
                                            color: '#E2E8F0',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                                            backdropFilter: 'blur(8px)'
                                        }}
                                    />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="accuracy"
                                        stroke={COLORS.primary}
                                        fillOpacity={1}
                                        fill="url(#colorAccuracy)"
                                        strokeWidth={3}
                                        name="Accuracy %"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="analytics-grid">
                        {/* Topic Mastery Radar Chart */}
                        <div className="chart-card">
                            <div className="chart-header">
                                <div>
                                    <h2>🎯 Topic Mastery Map</h2>
                                    <p>Your performance across different topics</p>
                                </div>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={350}>
                                    <RadarChart data={topicMasteryData}>
                                        <PolarGrid stroke="var(--border-color)" />
                                        <PolarAngleAxis dataKey="topic" stroke="var(--text-secondary)" />
                                        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="var(--text-secondary)" />
                                        <Radar
                                            name="Mastery Score"
                                            dataKey="mastery"
                                            stroke={COLORS.primary}
                                            fill={COLORS.primary}
                                            fillOpacity={0.6}
                                            strokeWidth={2}
                                        />
                                        <Radar
                                            name="Accuracy"
                                            dataKey="accuracy"
                                            stroke={COLORS.success}
                                            fill={COLORS.success}
                                            fillOpacity={0.4}
                                            strokeWidth={2}
                                        />
                                        <Legend />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(15, 22, 40, 0.95)',
                                                border: '1px solid rgba(0, 229, 255, 0.2)',
                                                borderRadius: '12px',
                                                color: '#E2E8F0',
                                                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                                                backdropFilter: 'blur(8px)'
                                            }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Readiness Score Breakdown */}
                        <div className="chart-card">
                            <div className="chart-header">
                                <div>
                                    <h2>💡 Readiness Breakdown</h2>
                                    <p>Components of your readiness score</p>
                                </div>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie
                                            data={readinessBreakdownData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {readinessBreakdownData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(15, 22, 40, 0.95)',
                                                border: '1px solid rgba(0, 229, 255, 0.2)',
                                                borderRadius: '12px',
                                                color: '#E2E8F0',
                                                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                                                backdropFilter: 'blur(8px)'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Subject-wise Performance */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <div>
                                <h2>📚 Subject-wise Performance</h2>
                                <p>Compare your performance across different subjects</p>
                            </div>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={subjectData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                    <XAxis dataKey="subject" stroke="var(--text-secondary)" />
                                    <YAxis yAxisId="left" stroke="var(--text-secondary)" />
                                    <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '12px',
                                            color: '#0F172A',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
                                        }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="attempts" fill={COLORS.primary} name="Total Attempts" radius={[8, 8, 0, 0]} />
                                    <Bar yAxisId="right" dataKey="avgAccuracy" fill={COLORS.success} name="Avg Accuracy %" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Weak Topics Detailed Analysis */}
                    {weakTopics?.weakTopics?.length > 0 && (
                        <div className="chart-card">
                            <div className="chart-header">
                                <div>
                                    <h2>⚠️ Weak Topics - Detailed Analysis</h2>
                                    <p>Topics that need your attention</p>
                                </div>
                            </div>
                            <div className="weak-topics-grid">
                                {weakTopics.weakTopics.map((topic, index) => (
                                    <div key={index} className="weak-topic-card">
                                        <div className="weak-topic-header">
                                            <h3>{topic.topic?.concept || 'Unknown Topic'}</h3>
                                            <span className="topic-badge" style={{ background: topic.topic?.subject }}>
                                                {topic.topic?.subject}
                                            </span>
                                        </div>
                                        <div className="weak-topic-stats">
                                            <div className="topic-stat">
                                                <span className="stat-label">Mastery Score</span>
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width: `${topic.masteryScore}%`,
                                                            background: getScoreColor(topic.masteryScore)
                                                        }}
                                                    />
                                                </div>
                                                <span className="stat-value" style={{ color: getScoreColor(topic.masteryScore) }}>
                                                    {topic.masteryScore.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="topic-stat">
                                                <span className="stat-label">Accuracy</span>
                                                <span className="stat-value">{topic.accuracy.toFixed(1)}%</span>
                                            </div>
                                            <div className="topic-stat">
                                                <span className="stat-label">Total Attempts</span>
                                                <span className="stat-value">{topic.totalAttempts}</span>
                                            </div>
                                            <div className="topic-stat">
                                                <span className="stat-label">Unresolved Mistakes</span>
                                                <span className="stat-value danger">{topic.unresolvedMistakes}</span>
                                            </div>
                                        </div>
                                        <div className="topic-recommendations">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <h4 style={{ marginBottom: 0 }}>💡 Recommendations:</h4>
                                                <a
                                                    href={getLearnUrl(topic.topic?.subject, topic.topic?.concept)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="learn-btn-small"
                                                    title={`Learn ${topic.topic?.concept} on W3Schools`}
                                                    style={{
                                                        fontSize: '0.8rem',
                                                        padding: '4px 10px',
                                                        background: 'var(--primary-600)',
                                                        color: 'white',
                                                        borderRadius: '6px',
                                                        textDecoration: 'none'
                                                    }}
                                                >
                                                    📖 Learn
                                                </a>
                                            </div>
                                            <ul>
                                                {topic.recommendations.map((rec, idx) => (
                                                    <li key={idx}>{rec}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Improvement Goals */}
                    <div className="chart-card goals-card">
                        <div className="chart-header">
                            <div>
                                <h2>🎯 Your Improvement Goals</h2>
                                <p>Personalized targets based on your performance</p>
                            </div>
                        </div>
                        <div className="goals-grid">
                            <div className="goal-item">
                                <div className="goal-icon">🎯</div>
                                <h3>Accuracy Target</h3>
                                <p>Reach 85% overall accuracy</p>
                                <div className="goal-progress">
                                    <div className="goal-progress-bar">
                                        <div
                                            className="goal-progress-fill"
                                            style={{ width: `${(parseFloat(analytics?.overview?.overallAccuracy || 0) / 85) * 100}%` }}
                                        />
                                    </div>
                                    <span>{analytics?.overview?.overallAccuracy || 0}% / 85%</span>
                                </div>
                            </div>

                            <div className="goal-item">
                                <div className="goal-icon">📚</div>
                                <h3>Practice Goal</h3>
                                <p>Complete 100 more questions</p>
                                <div className="goal-progress">
                                    <div className="goal-progress-bar">
                                        <div
                                            className="goal-progress-fill"
                                            style={{ width: `${((analytics?.overview?.totalAttempts || 0) / 100) * 100}%` }}
                                        />
                                    </div>
                                    <span>{analytics?.overview?.totalAttempts || 0} / 100</span>
                                </div>
                            </div>

                            <div className="goal-item">
                                <div className="goal-icon">💪</div>
                                <h3>Weak Topics</h3>
                                <p>Improve all topics above 60%</p>
                                <div className="goal-progress">
                                    <div className="goal-progress-bar">
                                        <div
                                            className="goal-progress-fill"
                                            style={{
                                                width: `${((analytics?.topicStats?.all?.length || 0) - (weakTopics?.count || 0)) /
                                                    (analytics?.topicStats?.all?.length || 1) * 100
                                                    }%`
                                            }}
                                        />
                                    </div>
                                    <span>
                                        {(analytics?.topicStats?.all?.length || 0) - (weakTopics?.count || 0)} / {analytics?.topicStats?.all?.length || 0} topics
                                    </span>
                                </div>
                            </div>

                            <div className="goal-item">
                                <div className="goal-icon">🏆</div>
                                <h3>Readiness Score</h3>
                                <p>Achieve 80+ readiness score</p>
                                <div className="goal-progress">
                                    <div className="goal-progress-bar">
                                        <div
                                            className="goal-progress-fill"
                                            style={{ width: `${((readiness?.interviewReadinessScore || 0) / 80) * 100}%` }}
                                        />
                                    </div>
                                    <span>{Math.round(readiness?.interviewReadinessScore || 0)} / 80</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Analytics;

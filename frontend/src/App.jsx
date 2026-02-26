import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
const AuthPage = React.lazy(() => import('./pages/Auth/AuthPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const Quiz = React.lazy(() => import('./pages/Quiz/Quiz'));
const QuizResults = React.lazy(() => import('./pages/Quiz/QuizResults'));
const ResultsHistory = React.lazy(() => import('./pages/Quiz/ResultsHistory'));
const Analytics = React.lazy(() => import('./pages/Analytics/Analytics'));
const Profile = React.lazy(() => import('./pages/Profile/Profile'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/Admin/AdminDashboard'));
const ManageQuestions = React.lazy(() => import('./pages/Admin/ManageQuestions'));
const ManageTopics = React.lazy(() => import('./pages/Admin/ManageTopics'));
const ManageUsers = React.lazy(() => import('./pages/Admin/ManageUsers'));
const ActivityLogs = React.lazy(() => import('./pages/Admin/ActivityLogs'));

// Landing Page
const LandingPage = React.lazy(() => import('./pages/Landing/LandingPage'));

// Quiz Workflow Visualization
const QuizWorkflow = React.lazy(() => import('./pages/QuizWorkflow/QuizWorkflow'));

// Live Quiz Pages
const CreateLiveQuiz = React.lazy(() => import('./pages/LiveQuiz/CreateLiveQuiz'));
const JoinLiveQuiz = React.lazy(() => import('./pages/LiveQuiz/JoinLiveQuiz'));
const LiveQuizLobby = React.lazy(() => import('./pages/LiveQuiz/LiveQuizLobby'));
const LiveQuizSession = React.lazy(() => import('./pages/LiveQuiz/LiveQuizSession'));
const LiveQuizHistory = React.lazy(() => import('./pages/LiveQuiz/LiveQuizHistory'));
const LiveQuizActive = React.lazy(() => import('./pages/LiveQuiz/LiveQuizActive'));

function App() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#0a0e1a'
            }}>
                <div className="spinner" style={{ borderTopColor: '#00E5FF' }} />
            </div>
        );
    }

    return (
        <Router>
            <React.Suspense fallback={
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: '#0a0e1a'
                }}>
                    <div className="spinner" style={{ borderTopColor: '#00E5FF' }} />
                </div>
            }>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/register" element={<AuthPage />} />

                    {/* Protected Routes Wrapper */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/workflow" element={<QuizWorkflow />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/results" element={<ResultsHistory />} />
                        <Route path="/results/:sessionId" element={<QuizResults />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/profile" element={<Profile />} />

                        {/* Live Quiz Routes */}
                        <Route path="/live-quiz/join" element={<JoinLiveQuiz />} />
                        <Route path="/live-quiz/session/:id" element={<LiveQuizSession />} />
                        <Route path="/live-quiz/history" element={<LiveQuizHistory />} />

                        {/* Admin/Tool Routes */}
                        <Route path="/live-quiz/create" element={<CreateLiveQuiz />} />
                        <Route path="/live-quiz/lobby/:id" element={<LiveQuizLobby />} />
                        <Route path="/live-quiz/active" element={<LiveQuizActive />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/questions" element={<ManageQuestions />} />
                        <Route path="/admin/topics" element={<ManageTopics />} />
                        <Route path="/admin/users" element={<ManageUsers />} />
                        <Route path="/admin/logs" element={<ActivityLogs />} />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </React.Suspense>
        </Router>
    );
}

export default App;

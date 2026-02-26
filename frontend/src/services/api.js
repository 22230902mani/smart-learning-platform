import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip refresh logic for Login and Password change routes
        const skipRefresh = [
            '/auth/login',
            '/auth/register',
            '/auth/change-password'
        ].some(path => originalRequest.url.includes(path));

        if (error.response?.status === 401 && !originalRequest._retry && !skipRefresh) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken
                });

                const { token } = response.data.data;
                localStorage.setItem('token', token);

                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/change-password', data)
};

// Quiz API
export const quizAPI = {
    startQuiz: (data) => api.post('/quiz/start', data),
    submitAnswer: (data) => api.post('/quiz/submit', data),
    getResults: (sessionId) => api.get(`/quiz/results/${sessionId}`)
};

// Questions API
export const questionsAPI = {
    getAll: (params) => api.get('/questions', { params }),
    getOne: (id) => api.get(`/questions/${id}`),
    create: (data) => api.post('/questions', data),
    update: (id, data) => api.put(`/questions/${id}`, data),
    delete: (id) => api.delete(`/questions/${id}`),
    bulkCreate: (data) => api.post('/questions/bulk', data),
    getStats: (id) => api.get(`/questions/${id}/stats`)
};

// Topics API
export const topicsAPI = {
    getAll: (params) => api.get('/topics', { params }),
    getOne: (id) => api.get(`/topics/${id}`),
    create: (data) => api.post('/topics', data),
    update: (id, data) => api.put(`/topics/${id}`, data),
    delete: (id) => api.delete(`/topics/${id}`),
    getSubjects: () => api.get('/topics/subjects')
};

// Analytics API
export const analyticsAPI = {
    getStudentAnalytics: (userId) => api.get(userId ? `/analytics/student/${userId}` : '/analytics/student'),
    getWeakTopics: (userId) => api.get(userId ? `/analytics/weak-topics/${userId}` : '/analytics/weak-topics'),
    getReadinessScore: (userId) => api.get(userId ? `/analytics/readiness/${userId}` : '/analytics/readiness'),
    getAttemptHistory: (userId, params) => api.get(userId ? `/analytics/attempts/${userId}` : '/analytics/attempts', { params }),
    getQuizHistory: (userId) => api.get(userId ? `/analytics/history/${userId}` : '/analytics/history'),
    getAdminAnalytics: () => api.get('/analytics/admin')
};

// Admin API
export const adminAPI = {
    getAllUsers: (params) => api.get('/admin/users', { params }),
    getUser: (id) => api.get(`/admin/users/${id}`),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getActivityLogs: (params) => api.get('/admin/activity-logs', { params }),
    getSystemStats: () => api.get('/admin/stats')
};

// Live Quiz API
export const liveQuizAPI = {
    create: (data) => api.post('/live-quiz/create', data),
    join: (joinId) => api.get(`/live-quiz/join/${joinId}`),
    getDetails: (id) => api.get(`/live-quiz/${id}`),
    getCreatorHistory: () => api.get('/live-quiz/creator/history'),
    getStudentHistory: () => api.get('/live-quiz/student/history')
};

export default api;

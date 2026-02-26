import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'

// Helper: read current theme so toast matches
const getToastStyle = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark
        ? {
            background: 'rgba(15, 22, 40, 0.95)',
            color: '#E2E8F0',
            borderRadius: '12px',
            padding: '14px 18px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0,229,255,0.06)',
            backdropFilter: 'blur(12px)',
        }
        : {
            background: '#FFFFFF',
            color: '#0F172A',
            borderRadius: '12px',
            padding: '14px 18px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        };
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: getToastStyle(),
                    success: {
                        iconTheme: {
                            primary: document.documentElement.getAttribute('data-theme') === 'dark'
                                ? '#00E5FF'
                                : '#F97316',
                            secondary: document.documentElement.getAttribute('data-theme') === 'dark'
                                ? '#0a0e1a'
                                : '#fff'
                        }
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff'
                        }
                    }
                }}
            />
        </AuthProvider>
    </React.StrictMode>,
)

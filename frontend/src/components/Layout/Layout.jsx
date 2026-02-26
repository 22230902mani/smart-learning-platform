import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';
import './Layout.css';
import './Sidebar.css';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="layout-container">
            <MobileHeader toggleSidebar={toggleSidebar} />

            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={toggleSidebar}
                />
            )}

            <main className="main-content">
                <Outlet />
            </main>

            <BottomNav />
        </div>
    );
};

export default Layout;

import React from 'react';
import './MobileHeader.css';

const MobileHeader = ({ toggleSidebar }) => {
    return (
        <header className="mobile-header">
            <div className="mobile-header-top">
                <div className="mobile-brand">
                    <span className="logo-icon">🧠</span>
                    <span className="logo-text">SmartPrep AI</span>
                </div>
                <div className="mobile-header-actions">
                    <span className="notification-bell">🔔</span>
                </div>
            </div>
            <div className="mobile-search-bar">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search topics, questions..." readOnly />
            </div>
        </header>
    );
};

export default MobileHeader;

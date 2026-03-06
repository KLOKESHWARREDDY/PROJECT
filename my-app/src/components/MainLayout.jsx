import React from 'react';
import './MainLayout.css';

/**
 * MainLayout wrapper to handle global centering and transparent background.
 * Use this as a wrapper for your page content to fix the side-margin issues.
 */
const MainLayout = ({ children }) => {
    return (
        <main className="layout-wrapper">
            <div className="layout-container">
                {children}
            </div>
        </main>
    );
};

export default MainLayout;

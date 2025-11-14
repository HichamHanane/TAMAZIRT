import React from 'react';
import { Loader2, Zap } from 'lucide-react';
import './AppLoader.css';

const AppLoader = () => {
    return (
        <div className="app-loader-container">
            <div className="loader-card">
                <Zap size={36} className="app-loader-icon" />
                <Loader2 size={28} className="spinner-loader" />
                <h1 className="loader-title">TAMAZIRT</h1>
                <p className="loader-subtitle">Loading your journey...</p>
            </div>
        </div>
    );
};

export default AppLoader;
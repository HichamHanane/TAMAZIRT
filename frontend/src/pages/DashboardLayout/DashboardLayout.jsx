import React from 'react';
import { Outlet } from 'react-router-dom';
import { User2, User as UserIcon } from 'lucide-react';
import './DashboardLayout.css';
import Sidebar from '../../components/Sidebar/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="dashboard-container">

            <Sidebar />

            <main className="dashboard-main-content">
                <header className="dashboard-header">
                    <div className="header-user-info">
                        <span className="user-name">Amina El-Fassi</span>
                        <span className="user-role">Administrator</span>
                    </div>
                    <div className="header-avatar">
                        {/* <img src={userAvatar} alt="User Avatar" className="avatar-img" /> */}
                        {/* <User2 /> */}
                    </div>
                </header>

                <div className="dashboard-content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
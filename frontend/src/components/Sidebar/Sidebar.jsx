// src/components/Sidebar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    UserCircle,
    Settings,
    LogOut,
    MessageSquareText,
} from 'lucide-react';
import '../../pages/DashboardLayout/DashboardLayout.css';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        const currentPath = location.pathname;
        if (path === '/dashboard') {
            return currentPath === path || currentPath === path + '/';
        }
        return currentPath.startsWith(path) && (currentPath.length === path.length || currentPath.charAt(path.length) === '/');
    };


    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">
                <MessageSquareText size={24} className="sidebar-logo-icon" />
                <h1 className="sidebar-app-name">TAMAZIRT</h1>
                <p className="sidebar-admin-panel">Admin Panel</p>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <Link
                            to="/dashboard"
                            className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                        >
                            <LayoutDashboard size={20} className="nav-icon" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/users"
                            className={`nav-item ${isActive('/dashboard/users') ? 'active' : ''}`}
                        >
                            <Users size={20} className="nav-icon" />
                            <span>Users</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/navigators"
                            className={`nav-item ${isActive('/dashboard/navigators') ? 'active' : ''}`}
                        >
                            <Briefcase size={20} className="nav-icon" />
                            <span>Navigators</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/tourists"
                            className={`nav-item ${isActive('/dashboard/tourists') ? 'active' : ''}`}
                        >
                            <UserCircle size={20} className="nav-icon" />
                            <span>Tourists</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/settings"
                            className={`nav-item ${isActive('/dashboard/settings') ? 'active' : ''}`}
                        >
                            <Settings size={20} className="nav-icon" />
                            <span>Settings</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="sidebar-footer">
                <Link to="/logout" className="nav-item logout">
                    <LogOut size={20} className="nav-icon" />
                    <span>Logout</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
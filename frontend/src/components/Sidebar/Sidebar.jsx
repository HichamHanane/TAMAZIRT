import React from 'react';
import { Link } from 'react-router-dom';
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
                        <Link to="/dashboard" className="nav-item active">
                            <LayoutDashboard size={20} className="nav-icon" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/users" className="nav-item">
                            <Users size={20} className="nav-icon" />
                            <span>Users</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/navigators" className="nav-item">
                            <Briefcase size={20} className="nav-icon" />
                            <span>Navigators</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/tourists" className="nav-item">
                            <UserCircle size={20} className="nav-icon" />
                            <span>Tourists</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings" className="nav-item">
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
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, UserCircle, MessageSquare, Star, Calendar, LogOut, CheckCircle2, Menu
} from 'lucide-react';
import './GuideDashboardLayout.css';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../feature/AuthSlice';

const navItems = [
    { name: 'Profile', path: '/guide/profile', icon: UserCircle },
    // { name: 'Dashboard', path: '/guide/dashboard', icon: LayoutDashboard },
    { name: 'Requests', path: '/guide/requests', icon: MessageSquare },
    { name: 'Reviews', path: '/guide/reviews', icon: Star },
];

const GuideDashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = async () => {

        try {
            let result = await dispatch(logoutUser());
            if (result.meta.requestStatus == "fulfilled") {
                navigate('/')
                toast.success('You Successfully Logged out');
                return
            }
        } catch (error) {
            console.log("Error while logging out the use : ", error);

        }
    }

    return (
        <div className="g-layout-container">

            <aside className={`g-layout-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="g-sidebar-header">
                    <h2 className="g-sidebar-logo">Tamazirt</h2>
                    <p className="g-sidebar-subtitle">For Guides</p>
                </div>

                <nav className="g-sidebar-nav">
                    <ul>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className={`g-nav-item ${isActive ? 'active' : ''}`}
                                    >
                                        <Icon size={20} className="g-nav-icon" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>



                <div className="g-sidebar-footer">
                    <button className="g-nav-item g-logout-btn" onClick={handleLogout}>
                        <LogOut size={20} className="g-nav-icon" />
                        <span>Logout</span>
                    </button>
                </div>

            </aside>

            <main className="g-main-content">
                <button className="g-sidebar-toggle" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <div className="g-content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default GuideDashboardLayout;
// src/layouts/GuideDashboardLayout.jsx

import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, UserCircle, MessageSquare, Star, Calendar, LogOut, CheckCircle2, Menu
} from 'lucide-react';
import './GuideDashboardLayout.css';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../feature/AuthSlice';
// Ajout des imports pour la déconnexion si la logique est dans le composant
// import { logoutUser } from '../../feature/AuthSlice'; 
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

const navItems = [
    { name: 'Dashboard', path: '/guide/dashboard', icon: LayoutDashboard },
    { name: 'Requests', path: '/guide/requests', icon: MessageSquare },
    { name: 'Calendar', path: '/guide/calendar', icon: Calendar },
    { name: 'Reviews', path: '/guide/reviews', icon: Star },
    { name: 'Profile', path: '/guide/profile', icon: UserCircle },
];

const GuideDashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // Ferme la barre latérale lorsque l'utilisateur navigue sur une nouvelle route
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

            {/* --- Guide Sidebar --- */}
            <aside className={`g-layout-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="g-sidebar-header">
                    <h2 className="g-sidebar-logo">Tamazirt</h2>
                    <p className="g-sidebar-subtitle">For Guides</p>
                </div>

                <nav className="g-sidebar-nav">
                    <ul>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            // Détermine si le chemin est actif pour styliser l'élément
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



                {/* Logout Button (Bas) */}
                <div className="g-sidebar-footer">
                    <button className="g-nav-item g-logout-btn" onClick={handleLogout}>
                        <LogOut size={20} className="g-nav-icon" />
                        <span>Logout</span>
                    </button>
                </div>

            </aside>

            {/* --- Main Content Area (Conteneur de défilement) --- */}
            <main className="g-main-content">
                {/* Burger menu pour mobile (bouton flottant) */}
                <button className="g-sidebar-toggle" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>

                {/* Top Bar pour le Contenu Principal */}


                {/* Contenu rendu par les routes imbriquées (Outlet) */}
                <div className="g-content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default GuideDashboardLayout;
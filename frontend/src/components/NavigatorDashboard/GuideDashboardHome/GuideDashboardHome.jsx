// src/pages/guide/GuideDashboardHome.jsx

import React from 'react';
import {
    CalendarCheck, // Upcoming Trips
    MessageSquareText, // New Requests
    Star, // Total Reviews
    TrendingUp, // Earnings
    ChevronRight, // Action icon
    Loader2
} from 'lucide-react';
import './GuideDashboardHome.css';
import { useSelector } from 'react-redux';

// --- MOCK DATA ---
const statsData = [
    {
        title: "Upcoming Trips",
        value: "4",
        icon: CalendarCheck,
        colorClass: "card-blue",
    },
    {
        title: "New Requests",
        value: "2",
        icon: MessageSquareText,
        colorClass: "card-red",
    },
    {
        title: "Total Reviews",
        value: "105",
        icon: Star,
        colorClass: "card-green",
    },
    {
        title: "Total Earnings",
        value: "€ 4,200",
        icon: TrendingUp,
        colorClass: "card-yellow",
    },
];

const latestRequests = [
    {
        id: 1,
        touristName: "Olivia Martinez",
        destination: "Marrakech",
        date: "2025-11-20",
        status: "Pending",
    },
    {
        id: 2,
        touristName: "Liam Johnson",
        destination: "Casablanca",
        date: "2025-11-18",
        status: "Confirmed",
    },
    {
        id: 3,
        touristName: "Ethan Brown",
        destination: "Fes",
        date: "2025-11-15",
        status: "Completed",
    },
    {
        id: 4,
        touristName: "Sophia Garcia",
        destination: "Essaouira",
        date: "2025-11-10",
        status: "Completed",
    },
];
// --- END MOCK DATA ---


// StatCard Component (Extrait du DashboardHome pour la lisibilité)
const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className={`g-home-stat-card ${colorClass}`}>
        <div className="g-home-card-icon-wrapper">
            <Icon size={24} className="g-home-card-icon" />
        </div>
        <div className="g-home-card-content">
            <p className="g-home-card-title">{title}</p>
            <h3 className="g-home-card-value">{value}</h3>
        </div>
    </div>
);


const GuideDashboardHome = () => {
    const { error, profile, isLoading } = useSelector(state => state.profile.user_profile);
    return (
        <div className="g-home-container">
            <header className="g-main-header">
                <div className="g-header-left">
                    <h1 className="g-header-greeting">Hello, {profile?.user?.name}!</h1>
                    <p className="g-header-subtitle">Welcome back. Here's what's happening today.</p>
                </div>

            </header>
            {/* --- 1. Statistics Cards Grid --- */}
            <div className="g-home-stats-grid">
                {statsData.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* --- 2. Main Content Wrapper (Latest Requests & Upcoming Trips) --- */}
            <div className="g-home-main-grid">

                {/* --- Latest Tour Requests --- */}
                <div className="g-home-requests-card">
                    <h3 className="g-home-section-title">Latest Tour Requests</h3>
                    <div className="g-home-requests-table-container">
                        <table className="g-home-requests-table">
                            <thead>
                                <tr>
                                    <th>Tourist Name</th>
                                    <th>Destination</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestRequests.map(request => (
                                    <tr key={request.id}>
                                        <td data-label="Tourist Name">{request.touristName}</td>
                                        <td data-label="Destination">{request.destination}</td>
                                        <td data-label="Date">{request.date}</td>
                                        <td data-label="Status">
                                            <span className={`g-home-request-status-badge ${request.status.toLowerCase()}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td data-label="Actions">
                                            <button className="g-home-action-view-details">
                                                View Details
                                                <ChevronRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- Upcoming Trips Card --- */}
                <div className="g-home-upcoming-trips-card">
                    <h3 className="g-home-section-title">Upcoming Trips</h3>
                    <p className="g-home-placeholder-text">Next trip: Marrakech Adventure, November 15th-18th. View details in Calendar.</p>
                    <button className="g-home-view-calendar-btn">View Calendar</button>
                </div>

            </div>
        </div>
    );
};

export default GuideDashboardHome;
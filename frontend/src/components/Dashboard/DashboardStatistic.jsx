import React, { useState, useEffect } from 'react';
import './DashboardStatistic.css';
import axios from 'axios';
import api from '../../utils/api/axios';

const DashboardStatistic = () => {
    const [stats, setStats] = useState({
        navigators_count: 0,
        tourists_count: 0,
        requests_count: 0,
        this_month_requests: [],
        today_requests: [],
        loading: true,
        error: null,
    });

    const [requestsToShow, setRequestsToShow] = useState([]);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await api.get('admin/statistics');

                const data = response.data;

                setStats({
                    navigators_count: data.navigators_count,
                    tourists_count: data.tourists_count,
                    requests_count: data.requests_count,
                    this_month_requests: data.this_month_requests,
                    today_requests: data.today_requests,
                    loading: false,
                    error: null,
                });
                setRequestsToShow(data.this_month_requests);


            } catch (err) {
                console.error("Error while fetching admin statistics :", err);
                setStats(prevStats => ({
                    ...prevStats,
                    loading: false,
                    error: "Faild to fetch admin statistics"
                }));
            }
        };

        fetchStatistics();
    }, []);

    const statCardsData = [
        { title: 'Total Navigators', value: stats.navigators_count.toLocaleString() },
        { title: 'Total Tourists', value: stats.tourists_count.toLocaleString() },
        { title: 'Total Trip Requests', value: stats.requests_count.toLocaleString() },
    ];

    if (stats.loading) {
        return <div className="loading-message">Loading Statistics...</div>;
    }

    if (stats.error) {
        return <div className="error-message">{stats.error}</div>;
    }


    return (
        <div>
            <div className="stats-grid">
                {statCardsData.map((stat, index) => (
                    <div className="stat-card" key={index}>
                        <p className="stat-card-title">{stat.title}</p>
                        <h2 className="stat-card-value">{stat.value}</h2>
                    </div>
                ))}
            </div>

            <h3 className="requests-section-title">This Month's Requests ({requestsToShow.length})</h3>
            <div className="requests-table-container">
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>Tourist</th> 
                            <th>Status</th>
                            <th>Guide</th>

                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestsToShow.length > 0 ? (
                            requestsToShow.map((request) => (
                                <tr key={request.id}>
                                    <td>{request?.tourist.name}</td>
                                    <td>
                                        <span className={`status-badge ${request.status ? request.status.toLowerCase() : 'pending'}`}>
                                            {request.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td>{request?.navigator.name}</td>

                                    <td>{new Date(request.created_at).toLocaleDateString()}</td>
                                    {/* <td>
                                        <button className="view-details-btn">View Details</button>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No Requests Found For now.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardStatistic;
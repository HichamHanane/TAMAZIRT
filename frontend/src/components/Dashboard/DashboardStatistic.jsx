import React from 'react';
import './DashboardStatistic.css';

const DashboardStatistic = () => {
    const stats = [
        { title: 'Total Navigators', value: '124' },
        { title: 'Total Tourists', value: '857' },
        { title: 'Total Trip Requests', value: '1,249' },
    ];

    const requests = [
        { id: 1, tourist: 'Olivia Martinez', navigator: 'Youssef Ait Benhaddou', status: 'Confirmed', date: '2023-10-15' },
        { id: 2, tourist: 'Benjamin Carter', navigator: 'Fatima Al-Fassi', status: 'Pending', date: '2023-10-14' },
        { id: 3, tourist: 'Sophia Rodriguez', navigator: 'Hassan El Olaoui', status: 'Completed', date: '2023-10-12' },
        { id: 4, tourist: 'Liam Goldberg', navigator: 'Amina Zari', status: 'Pending', date: '2023-10-11' },
    ];

    return (
        <div>
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div className="stat-card" key={index}>
                        <p className="stat-card-title">{stat.title}</p>
                        <h2 className="stat-card-value">{stat.value}</h2>
                    </div>
                ))}
            </div>

            <h3 className="requests-section-title">This Month's Requests</h3>
            <div className="requests-table-container">
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>Tourist Name</th>
                            <th>Assigned Navigator</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id}>
                                <td>{request.tourist}</td>
                                <td>{request.navigator}</td>
                                <td>
                                    <span className={`status-badge ${request.status.toLowerCase()}`}>
                                        {request.status}
                                    </span>
                                </td>
                                <td>{request.date}</td>
                                <td>
                                    <button className="view-details-btn">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardStatistic;
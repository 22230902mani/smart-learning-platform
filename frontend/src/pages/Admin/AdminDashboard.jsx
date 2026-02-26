import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1>Admin Dashboard</h1>
            <p>Coming soon: System overview, statistics, and quick actions.</p>
            <div className="card" style={{ marginTop: '2rem', padding: '2rem' }}>
                <p>⚙️ Admin features include:</p>
                <ul style={{ marginTop: '1rem', lineHeight: '2' }}>
                    <li>Total users, questions, and attempts</li>
                    <li>Recent activity feed</li>
                    <li>System health metrics</li>
                    <li>Quick action buttons</li>
                    <li>Analytics charts</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;

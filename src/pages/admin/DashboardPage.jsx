import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/bookingApi';
import AdminSidebar from '../../components/common/AdminSidebar';
import { Spinner } from '../../components/common';

const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-card-icon">{icon}</div>
    <div className="stat-card-value" style={{ color: color || 'var(--text)' }}>{value}</div>
    <div className="stat-card-label">{label}</div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then(res => setStats(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <h2 className="section-title">Admin <span>Dashboard</span></h2>

        {loading ? <Spinner /> : !stats ? null : (
          <>
            {/* Stats grid */}
            <div className="grid-4" style={{ marginBottom: '2rem' }}>
              <StatCard icon="👥" label="Total Users"     value={stats.totalUsers}     color="var(--primary)" />
              <StatCard icon="🚌" label="Total Buses"     value={stats.totalBuses}     color="var(--accent)"  />
              <StatCard icon="🗺️" label="Total Routes"    value={stats.totalRoutes}    />
              <StatCard icon="🗓️" label="Total Schedules" value={stats.totalSchedules} />
            </div>

            <div className="grid-4" style={{ marginBottom: '2rem' }}>
              <StatCard icon="🎫" label="Total Bookings"    value={stats.totalBookings}    />
              <StatCard icon="✅" label="Confirmed"         value={stats.confirmedBookings} color="var(--success)"  />
              <StatCard icon="⏳" label="Pending"           value={stats.pendingBookings}   color="var(--warning)"  />
              <StatCard icon="❌" label="Cancelled"         value={stats.cancelledBookings} color="var(--danger)"   />
            </div>

            {/* Revenue card */}
            <div className="card" style={{ maxWidth: 380 }}>
              <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>💰</div>
              <div style={{ fontFamily: 'Sora', fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent)' }}>
                ₹{stats.totalRevenue?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '.9rem', marginTop: '.25rem' }}>Total Revenue</div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

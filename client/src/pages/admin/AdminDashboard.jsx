import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import BookingStatusBadge from '../../components/BookingStatusBadge';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalTechnicians: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    inProgressBookings: 0,
    assignedBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/bookings/stats/dashboard'),
          api.get('/bookings')
        ]);
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (bookingsRes.data.success) {
          setRecentBookings(bookingsRes.data.data.slice(0, 7));
        }
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header-bar">
        <div>
          <h2>System Control Panel</h2>
          <p>Real-time metrics, booking assignments, customer management, and technician status.</p>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="metric-cards-row">
        <div className="metric-card">
          <div className="metric-icon bg-blue-subtle"><Users size={22} color="#2563eb" /></div>
          <div>
            <span className="metric-label">Total Customers</span>
            <h3 className="metric-value">{stats.totalCustomers}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-purple-subtle"><UserCheck size={22} color="#7c3aed" /></div>
          <div>
            <span className="metric-label">Total Technicians</span>
            <h3 className="metric-value">{stats.totalTechnicians}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-indigo-subtle"><Calendar size={22} color="#4f46e5" /></div>
          <div>
            <span className="metric-label">Total Bookings</span>
            <h3 className="metric-value">{stats.totalBookings}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-yellow-subtle"><Clock size={22} color="#d97706" /></div>
          <div>
            <span className="metric-label">Pending Bookings</span>
            <h3 className="metric-value">{stats.pendingBookings}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-green-subtle"><CheckCircle2 size={22} color="#16a34a" /></div>
          <div>
            <span className="metric-label">Completed Bookings</span>
            <h3 className="metric-value">{stats.completedBookings}</h3>
          </div>
        </div>
      </div>

      {/* Quick Action Links Bar */}
      <div className="admin-quick-actions-bar mt-6">
        <Link to="/admin/bookings?status=Pending" className="quick-action-chip warning">
          <AlertTriangle size={15} />
          <span>{stats.pendingBookings} Bookings Need Technician Assignment</span>
        </Link>
        <Link to="/admin/appliances" className="quick-action-chip">
          <Wrench size={15} />
          <span>Manage Appliance Categories</span>
        </Link>
        <Link to="/admin/services" className="quick-action-chip">
          <Calendar size={15} />
          <span>Manage Service Pricing</span>
        </Link>
      </div>

      {/* Recent Bookings List */}
      <div className="dashboard-section mt-8">
        <div className="dashboard-section-header">
          <h3>Latest Customer Bookings</h3>
          <Link to="/admin/bookings" className="view-all-link">
            Manage All Bookings ({stats.totalBookings}) <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex-center py-8">
            <div className="spinner"></div>
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="empty-state-box">
            <h4>No bookings found in the database.</h4>
          </div>
        ) : (
          <div className="bookings-table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Appliance & Service</th>
                  <th>Date & Time</th>
                  <th>Technician</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b._id}>
                    <td>
                      <code>#{b._id.slice(-6).toUpperCase()}</code>
                    </td>
                    <td>
                      <strong>{b.customer?.name}</strong>
                      <div className="sub-text">{b.phone}</div>
                    </td>
                    <td>
                      <strong>{b.appliance?.name}</strong>
                      <div className="sub-text">{b.service?.name} (${b.service?.price})</div>
                    </td>
                    <td>
                      <div>{b.preferredDate}</div>
                      <div className="sub-text">{b.preferredTime}</div>
                    </td>
                    <td>
                      {b.technician ? (
                        <span className="badge-tech">{b.technician.name}</span>
                      ) : (
                        <span className="badge-unassigned">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <BookingStatusBadge status={b.status} />
                    </td>
                    <td>
                      <Link to="/admin/bookings" className="btn btn-outline btn-xs">
                        Manage <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

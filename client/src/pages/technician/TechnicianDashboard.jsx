import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import BookingStatusBadge from '../../components/BookingStatusBadge';
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  ArrowRight,
  Phone,
  AlertCircle
} from 'lucide-react';

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const res = await api.get('/bookings/assigned/me');
        if (res.data.success) {
          setBookings(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching technician jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssigned();
  }, []);

  const assignedNew = bookings.filter(b => b.status === 'Assigned').length;
  const inProgress = bookings.filter(b => ['Accepted', 'In Progress'].includes(b.status)).length;
  const completed = bookings.filter(b => b.status === 'Completed').length;

  return (
    <div className="technician-dashboard">
      <div className="dashboard-header-bar">
        <div>
          <h2>Technician Workbench: {user?.name}</h2>
          <p>View assigned service calls, update job statuses, and add completion notes.</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metric-cards-row">
        <div className="metric-card">
          <div className="metric-icon bg-blue-subtle"><Wrench size={22} color="#2563eb" /></div>
          <div>
            <span className="metric-label">Total Assigned Jobs</span>
            <h3 className="metric-value">{bookings.length}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-yellow-subtle"><Clock size={22} color="#d97706" /></div>
          <div>
            <span className="metric-label">New Awaiting Acceptance</span>
            <h3 className="metric-value">{assignedNew}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-purple-subtle"><Wrench size={22} color="#7c3aed" /></div>
          <div>
            <span className="metric-label">Active / In Progress</span>
            <h3 className="metric-value">{inProgress}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-green-subtle"><CheckCircle2 size={22} color="#16a34a" /></div>
          <div>
            <span className="metric-label">Completed Jobs</span>
            <h3 className="metric-value">{completed}</h3>
          </div>
        </div>
      </div>

      {/* Recent Assigned Jobs */}
      <div className="dashboard-section mt-8">
        <div className="dashboard-section-header">
          <h3>Active & Recent Jobs</h3>
          <Link to="/technician/bookings" className="view-all-link">
            Manage All Jobs ({bookings.length}) <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex-center py-8">
            <div className="spinner"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state-box">
            <Wrench size={36} color="#9ca3af" />
            <h4>No jobs currently assigned</h4>
            <p>Admin will dispatch service bookings to your workbench as customers schedule appointments.</p>
          </div>
        ) : (
          <div className="bookings-table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job ID & Appliance</th>
                  <th>Customer Info</th>
                  <th>Appointment Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 6).map(b => (
                  <tr key={b._id}>
                    <td>
                      <strong>{b.appliance?.name}</strong>
                      <div className="sub-text">{b.service?.name}</div>
                      <small className="text-muted">ID: #{b._id.slice(-6).toUpperCase()}</small>
                    </td>
                    <td>
                      <div><strong>{b.customer?.name}</strong></div>
                      <div className="sub-text"><Phone size={12} /> {b.phone}</div>
                      <div className="sub-text text-muted truncate" style={{ maxWidth: '220px' }}>{b.address}</div>
                    </td>
                    <td>
                      <div>{b.preferredDate}</div>
                      <div className="sub-text">{b.preferredTime}</div>
                    </td>
                    <td>
                      <BookingStatusBadge status={b.status} />
                    </td>
                    <td>
                      <Link to={`/technician/bookings/${b._id}`} className="btn btn-primary btn-xs">
                        Open Job <ArrowRight size={14} />
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

export default TechnicianDashboard;

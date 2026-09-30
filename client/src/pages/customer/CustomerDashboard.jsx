import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import BookingStatusBadge from '../../components/BookingStatusBadge';
import { 
  CalendarPlus, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  Wrench, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my');
        if (res.data.success) {
          setBookings(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching customer bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const activeCount = bookings.filter(b => ['Assigned', 'Accepted', 'In Progress'].includes(b.status)).length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header-bar">
        <div>
          <h2>Welcome, {user?.name}!</h2>
          <p>Manage your home appliance repair appointments and book new service visits.</p>
        </div>
        <Link to="/customer/book" className="btn btn-primary">
          <CalendarPlus size={18} />
          <span>Book New Service</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="metric-cards-row">
        <div className="metric-card">
          <div className="metric-icon bg-blue-subtle"><CalendarPlus size={22} color="#2563eb" /></div>
          <div>
            <span className="metric-label">Total Bookings</span>
            <h3 className="metric-value">{bookings.length}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-yellow-subtle"><Clock size={22} color="#d97706" /></div>
          <div>
            <span className="metric-label">Pending Approval</span>
            <h3 className="metric-value">{pendingCount}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-purple-subtle"><Wrench size={22} color="#7c3aed" /></div>
          <div>
            <span className="metric-label">Active / In Progress</span>
            <h3 className="metric-value">{activeCount}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-green-subtle"><CheckCircle size={22} color="#16a34a" /></div>
          <div>
            <span className="metric-label">Completed Services</span>
            <h3 className="metric-value">{completedCount}</h3>
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="dashboard-section mt-8">
        <div className="dashboard-section-header">
          <h3>Recent Bookings</h3>
          <Link to="/customer/bookings" className="view-all-link">
            View All ({bookings.length}) <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex-center py-8">
            <div className="spinner"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state-box">
            <Wrench size={36} color="#9ca3af" />
            <h4>No service bookings yet</h4>
            <p>Need help with your AC, washing machine, or refrigerator?</p>
            <Link to="/customer/book" className="btn btn-primary btn-sm mt-3">
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <div className="bookings-table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Appliance & Service</th>
                  <th>Preferred Date & Slot</th>
                  <th>Assigned Technician</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b._id}>
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
                        <div>
                          <strong>{b.technician.name}</strong>
                          <div className="sub-text">{b.technician.phone}</div>
                        </div>
                      ) : (
                        <span className="text-muted">Awaiting Admin Assignment</span>
                      )}
                    </td>
                    <td>
                      <BookingStatusBadge status={b.status} />
                    </td>
                    <td>
                      <Link to={`/customer/bookings/${b._id}`} className="btn btn-outline btn-xs">
                        Details <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Helpful Guarantee Banner */}
      <div className="service-guarantee-card mt-8">
        <div className="guarantee-icon">
          <ShieldCheck size={32} color="#2563eb" />
        </div>
        <div>
          <h4>30-Day Doorstep Guarantee Active</h4>
          <p>Every completed job comes with our standard 30-day labor and spare parts warranty.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

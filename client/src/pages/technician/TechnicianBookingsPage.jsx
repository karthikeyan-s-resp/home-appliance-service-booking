import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import BookingStatusBadge from '../../components/BookingStatusBadge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  ArrowRight, 
  Filter, 
  Wrench, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const TechnicianBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
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

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.status === statusFilter));
    }
  }, [statusFilter, bookings]);

  return (
    <div className="technician-bookings-page">
      <div className="dashboard-header-bar">
        <div>
          <h2>Assigned Service Jobs</h2>
          <p>Review customer problem statements, contact details, update status, and log diagnostic notes.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-row">
        {['ALL', 'Assigned', 'Accepted', 'In Progress', 'Completed'].map(status => (
          <button
            key={status}
            className={`tab-btn ${statusFilter === status ? 'active' : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            {status}
            <span className="count-pill">
              {status === 'ALL' ? bookings.length : bookings.filter(b => b.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex-center py-12">
          <div className="spinner"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state-box mt-6">
          <Wrench size={40} color="#9ca3af" />
          <h4>No jobs in "{statusFilter}" status</h4>
          <p>Jobs assigned by admin dispatch will appear here automatically.</p>
        </div>
      ) : (
        <div className="bookings-cards-grid mt-6">
          {filteredBookings.map(b => (
            <div key={b._id} className="booking-summary-card">
              <div className="card-top-bar">
                <span className="booking-ref-id">Job #{b._id.slice(-6).toUpperCase()}</span>
                <BookingStatusBadge status={b.status} />
              </div>

              <div className="card-main-info">
                <h3>{b.appliance?.name}</h3>
                <h4 className="service-name-text">{b.service?.name} (${b.service?.price})</h4>
                <p className="problem-text-snippet"><strong>Issue:</strong> {b.problemDescription}</p>
              </div>

              <div className="card-meta-list">
                <div className="meta-item">
                  <Calendar size={14} />
                  <span>{b.preferredDate} ({b.preferredTime})</span>
                </div>
                <div className="meta-item">
                  <Phone size={14} />
                  <span>Customer: {b.phone} ({b.customer?.name})</span>
                </div>
                <div className="meta-item">
                  <MapPin size={14} />
                  <span className="truncate">{b.address}</span>
                </div>
              </div>

              <div className="card-bottom-bar">
                <span className="text-muted" style={{ fontSize: '13px' }}>
                  {b.serviceNotes ? `Note: ${b.serviceNotes.slice(0, 30)}...` : 'No service notes yet'}
                </span>
                <Link to={`/technician/bookings/${b._id}`} className="btn btn-primary btn-sm">
                  Manage Job <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicianBookingsPage;

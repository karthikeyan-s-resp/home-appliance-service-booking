import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import BookingStatusBadge from '../../components/BookingStatusBadge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Filter, 
  AlertCircle,
  CalendarPlus
} from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my');
        if (res.data.success) {
          setBookings(res.data.data);
          setFilteredBookings(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
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
    <div className="my-bookings-page">
      <div className="dashboard-header-bar">
        <div>
          <h2>My Service Bookings</h2>
          <p>Track progress, view assigned technician details, and review past service history.</p>
        </div>
        <Link to="/customer/book" className="btn btn-primary">
          <CalendarPlus size={18} />
          <span>New Booking</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-row">
        {['ALL', 'Pending', 'Assigned', 'Accepted', 'In Progress', 'Completed', 'Cancelled'].map(status => (
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
          <Calendar size={40} color="#9ca3af" />
          <h4>No bookings found for "{statusFilter}"</h4>
          <p>Looking for assistance with another home appliance?</p>
          <Link to="/customer/book" className="btn btn-outline btn-sm mt-3">
            Book an Appliance Service
          </Link>
        </div>
      ) : (
        <div className="bookings-cards-grid mt-6">
          {filteredBookings.map(b => (
            <div key={b._id} className="booking-summary-card">
              <div className="card-top-bar">
                <span className="booking-ref-id">ID: #{b._id.slice(-6).toUpperCase()}</span>
                <BookingStatusBadge status={b.status} />
              </div>

              <div className="card-main-info">
                <h3>{b.appliance?.name}</h3>
                <h4 className="service-name-text">{b.service?.name}</h4>
                <p className="problem-text-snippet">"{b.problemDescription}"</p>
              </div>

              <div className="card-meta-list">
                <div className="meta-item">
                  <Calendar size={14} />
                  <span>{b.preferredDate}</span>
                </div>
                <div className="meta-item">
                  <Clock size={14} />
                  <span>{b.preferredTime}</span>
                </div>
                <div className="meta-item">
                  <MapPin size={14} />
                  <span className="truncate">{b.address}</span>
                </div>
              </div>

              <div className="card-bottom-bar">
                <div className="tech-badge-mini">
                  {b.technician ? (
                    <span>Tech: <strong>{b.technician.name}</strong></span>
                  ) : (
                    <span className="text-muted">Tech pending assignment</span>
                  )}
                </div>
                <Link to={`/customer/bookings/${b._id}`} className="btn btn-primary btn-sm">
                  View Details <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;

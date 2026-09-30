import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import BookingStatusBadge from '../../components/BookingStatusBadge';
import BookingStatusTracker from '../../components/BookingStatusTracker';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  FileText,
  Save,
  ArrowRight
} from 'lucide-react';

const TechnicianBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [serviceNotes, setServiceNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchBooking = async () => {
    try {
      const res = await api.get(`/bookings/${id}`);
      if (res.data.success) {
        setBooking(res.data.data);
        setServiceNotes(res.data.data.serviceNotes || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.put(`/bookings/${id}/status`, {
        status: newStatus,
        serviceNotes
      });
      if (res.data.success) {
        setBooking(res.data.data);
        setSuccessMsg(`Status updated to "${newStatus}" successfully!`);
      }
    } catch (err) {
      setError(err.message || 'Status update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    setUpdating(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.put(`/bookings/${id}/status`, {
        serviceNotes
      });
      if (res.data.success) {
        setBooking(res.data.data);
        setSuccessMsg('Service notes saved successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to save notes');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="empty-state-box">
        <AlertCircle size={40} color="#ef4444" />
        <h3>Error Loading Job</h3>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm mt-4">
          <ChevronLeft size={16} /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="technician-job-details">
      <div className="details-header-actions mb-4">
        <button onClick={() => navigate('/technician/bookings')} className="btn btn-outline btn-sm">
          <ChevronLeft size={16} /> Back to Assigned Jobs
        </button>
      </div>

      {successMsg && (
        <div className="success-banner-box mb-6">
          <CheckCircle2 size={20} color="#16a34a" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert-danger mb-6">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Details Card */}
      <div className="details-main-card">
        <div className="details-top-row">
          <div>
            <span className="reference-code">JOB #{booking._id.toUpperCase()}</span>
            <h2>{booking.appliance?.name} - {booking.service?.name}</h2>
            <p className="booking-date-sub">
              Scheduled Date: <strong>{booking.preferredDate}</strong> ({booking.preferredTime})
            </p>
          </div>
          <div className="text-right">
            <BookingStatusBadge status={booking.status} />
            <div className="price-tag-lg mt-2">${booking.service?.price}</div>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="tracker-panel mt-6">
          <BookingStatusTracker currentStatus={booking.status} />
        </div>

        {/* Technician Workflow Control Panel */}
        <div className="tech-action-card mt-6">
          <div className="tech-action-header">
            <div>
              <h3>Service Workflow Control</h3>
              <p>Advance job stage according to your on-site service progress</p>
            </div>
            <span className="current-status-tag">Current: <strong>{booking.status}</strong></span>
          </div>

          <div className="tech-action-buttons mt-4">
            {booking.status === 'Assigned' && (
              <button
                onClick={() => handleUpdateStatus('Accepted')}
                disabled={updating}
                className="btn btn-primary"
              >
                <CheckCircle2 size={16} /> Accept Job Assignment
              </button>
            )}

            {booking.status === 'Accepted' && (
              <button
                onClick={() => handleUpdateStatus('In Progress')}
                disabled={updating}
                className="btn btn-warning"
              >
                <Wrench size={16} /> Mark In Progress (Start Service)
              </button>
            )}

            {booking.status === 'In Progress' && (
              <button
                onClick={() => handleUpdateStatus('Completed')}
                disabled={updating}
                className="btn btn-success"
              >
                <CheckCircle2 size={16} /> Complete Service Job
              </button>
            )}

            {booking.status === 'Completed' && (
              <div className="completed-notice">
                <CheckCircle2 size={20} color="#16a34a" />
                <span>This job has been marked as <strong>Completed</strong>. Great job!</span>
              </div>
            )}

            {booking.status === 'Cancelled' && (
              <div className="cancelled-notice">
                <AlertCircle size={20} color="#dc2626" />
                <span>This job has been cancelled.</span>
              </div>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="details-grid-layout mt-6">
          {/* Left Column: Customer details & Address */}
          <div className="details-column">
            <div className="detail-section-box">
              <h3><User size={18} /> Customer Contact</h3>
              <div className="info-kv-row">
                <span>Customer Name:</span>
                <strong>{booking.customer?.name}</strong>
              </div>
              <div className="info-kv-row">
                <span>Customer Email:</span>
                <span>{booking.customer?.email}</span>
              </div>
              <div className="info-kv-row">
                <span>Contact Phone:</span>
                <a href={`tel:${booking.phone}`} className="phone-link">
                  <Phone size={14} /> {booking.phone}
                </a>
              </div>
            </div>

            <div className="detail-section-box mt-6">
              <h3><MapPin size={18} /> Service Destination</h3>
              <p className="address-display">{booking.address}</p>
            </div>

            <div className="detail-section-box mt-6">
              <h3><FileText size={18} /> Customer Problem Description</h3>
              <p className="problem-text-full">{booking.problemDescription}</p>
            </div>
          </div>

          {/* Right Column: Service notes & Diagnosis */}
          <div className="details-column">
            <div className="detail-section-box">
              <h3><Wrench size={18} /> Technician Service Notes & Diagnosis</h3>
              <p className="sub-text mb-2">Record parts replaced, test results, or maintenance recommendations for customer and admin records.</p>
              
              <div className="form-group">
                <textarea
                  rows={6}
                  placeholder="e.g. Cleaned condenser coil, replaced 45uF capacitor, checked compressor pressure at 120 PSI. System running cold."
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                />
              </div>

              <button
                onClick={handleSaveNotes}
                disabled={updating}
                className="btn btn-outline btn-sm mt-3"
              >
                <Save size={14} /> Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianBookingDetails;

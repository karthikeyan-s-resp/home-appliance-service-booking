import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
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
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const justBooked = searchParams.get('booked') === 'true';

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchBooking = async () => {
    try {
      const res = await api.get(`/bookings/${id}`);
      if (res.data.success) {
        setBooking(res.data.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleCancelBooking = async () => {
    setCancelling(true);
    setError('');
    try {
      const res = await api.put(`/bookings/${id}/cancel`, { serviceNotes: cancelReason });
      if (res.data.success) {
        setBooking(res.data.data);
        setShowCancelModal(false);
        setFeedbackMsg('Your booking has been cancelled successfully.');
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="empty-state-box">
        <AlertCircle size={40} color="#ef4444" />
        <h3>Booking Not Found</h3>
        <p>{error || 'The requested booking could not be loaded.'}</p>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm mt-4">
          <ChevronLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const canCancel = ['Pending', 'Assigned'].includes(booking.status);

  return (
    <div className="booking-details-page">
      <div className="details-header-actions mb-4">
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
          <ChevronLeft size={16} /> Back to Bookings
        </button>
      </div>

      {justBooked && (
        <div className="success-banner-box mb-6">
          <CheckCircle2 size={28} color="#16a34a" />
          <div>
            <h4 style={{ margin: 0 }}>Booking Confirmed Successfully!</h4>
            <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
              Your appointment request is now pending admin technician assignment. You can track progress below.
            </p>
          </div>
        </div>
      )}

      {feedbackMsg && (
        <div className="success-banner-box mb-6">
          <CheckCircle2 size={24} color="#16a34a" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Booking Header Banner */}
      <div className="details-main-card">
        <div className="details-top-row">
          <div>
            <span className="reference-code">Order #{booking._id.toUpperCase()}</span>
            <h2>{booking.appliance?.name} - {booking.service?.name}</h2>
            <p className="booking-date-sub">
              Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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

        {/* Service Grid details */}
        <div className="details-grid-layout mt-8">
          {/* Left Column: Appointment & Problem */}
          <div className="details-column">
            <div className="detail-section-box">
              <h3><Calendar size={18} /> Appointment Schedule</h3>
              <div className="info-kv-row">
                <span>Preferred Date:</span>
                <strong>{booking.preferredDate}</strong>
              </div>
              <div className="info-kv-row">
                <span>Preferred Time Slot:</span>
                <strong>{booking.preferredTime}</strong>
              </div>
              <div className="info-kv-row">
                <span>Est. Service Duration:</span>
                <span>{booking.service?.estimatedDuration || '1-2 hours'}</span>
              </div>
            </div>

            <div className="detail-section-box mt-6">
              <h3><FileText size={18} /> Problem Description</h3>
              <p className="problem-text-full">{booking.problemDescription}</p>

              {booking.serviceNotes && (
                <div className="service-notes-box mt-4">
                  <strong>Technician / Admin Notes:</strong>
                  <p>{booking.serviceNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Address & Technician Info */}
          <div className="details-column">
            <div className="detail-section-box">
              <h3><MapPin size={18} /> Service Visit Location</h3>
              <p className="address-display">{booking.address}</p>
              <div className="info-kv-row mt-3">
                <span>Contact Phone:</span>
                <strong>{booking.phone}</strong>
              </div>
            </div>

            <div className="detail-section-box mt-6">
              <h3><User size={18} /> Assigned Technician</h3>
              {booking.technician ? (
                <div className="technician-info-card">
                  <div className="tech-avatar-circle">
                    {booking.technician.name.charAt(0)}
                  </div>
                  <div>
                    <h4>{booking.technician.name}</h4>
                    <p><Phone size={14} /> {booking.technician.phone || 'Direct contact available upon arrival'}</p>
                    <span className="verified-badge"><ShieldCheck size={13} /> FixPro Certified</span>
                  </div>
                </div>
              ) : (
                <div className="unassigned-notice">
                  <Clock size={20} color="#d97706" />
                  <div>
                    <strong>Technician Assignment in Progress</strong>
                    <p>Our dispatch team will assign the most qualified technician shortly.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Cancellation Option */}
            {canCancel && (
              <div className="cancellation-card mt-6">
                <h4>Need to cancel this appointment?</h4>
                <p>You can cancel without any charges before the technician begins service.</p>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="btn btn-outline-danger btn-sm mt-2"
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Cancel Service Booking</h3>
            <p>Are you sure you want to cancel appointment #{booking._id.slice(-6).toUpperCase()}?</p>
            <div className="form-group mt-4">
              <label>Reason for cancellation (optional):</label>
              <textarea
                rows={3}
                placeholder="e.g. Schedule conflict, problem resolved, etc."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div className="modal-actions mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn btn-outline"
                disabled={cancelling}
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="btn btn-danger"
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailsPage;

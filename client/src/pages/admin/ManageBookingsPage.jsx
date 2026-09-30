import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import BookingStatusBadge from '../../components/BookingStatusBadge';
import { 
  Search, 
  Filter, 
  UserCheck, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Calendar, 
  Phone, 
  MapPin,
  Eye
} from 'lucide-react';

const ManageBookingsPage = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';

  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Assignment Modal
  const [assignModalBooking, setAssignModalBooking] = useState(null);
  const [selectedTechId, setSelectedTechId] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Status Change Modal
  const [statusModalBooking, setStatusModalBooking] = useState(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState('');
  const [serviceNotes, setServiceNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Details Modal
  const [detailsModalBooking, setDetailsModalBooking] = useState(null);

  const [notification, setNotification] = useState({ type: '', message: '' });

  const fetchData = async () => {
    try {
      const [bookingsRes, techsRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/users/technicians')
      ]);
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.data);
      }
      if (techsRes.data.success) {
        setTechnicians(techsRes.data.data);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to load bookings' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignTechnician = async (e) => {
    e.preventDefault();
    if (!selectedTechId) return;

    setAssigning(true);
    try {
      const res = await api.put(`/bookings/${assignModalBooking._id}/assign`, {
        technicianId: selectedTechId
      });
      if (res.data.success) {
        setNotification({ type: 'success', message: 'Technician successfully assigned to booking!' });
        setAssignModalBooking(null);
        fetchData();
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to assign technician' });
    } finally {
      setAssigning(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedNewStatus) return;

    setUpdatingStatus(true);
    try {
      const res = await api.put(`/bookings/${statusModalBooking._id}/status`, {
        status: selectedNewStatus,
        serviceNotes
      });
      if (res.data.success) {
        setNotification({ type: 'success', message: 'Booking status updated!' });
        setStatusModalBooking(null);
        fetchData();
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to update status' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this booking record?')) {
      return;
    }

    try {
      const res = await api.delete(`/bookings/${id}`);
      if (res.data.success) {
        setNotification({ type: 'success', message: 'Booking deleted successfully' });
        setBookings(bookings.filter(b => b._id !== id));
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete booking' });
    }
  };

  // Filter Bookings
  const filtered = bookings.filter(b => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      b.appliance?.name?.toLowerCase().includes(q) ||
      b.service?.name?.toLowerCase().includes(q) ||
      b.customer?.name?.toLowerCase().includes(q) ||
      b.technician?.name?.toLowerCase().includes(q) ||
      b.phone?.includes(q) ||
      b._id.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="manage-bookings-page">
      <div className="dashboard-header-bar">
        <div>
          <h2>Manage Customer Bookings</h2>
          <p>Assign technicians, track workflow stages, update statuses, or remove records.</p>
        </div>
      </div>

      {notification.message && (
        <div className={`mb-6 ${notification.type === 'error' ? 'alert-danger' : 'success-banner-box'}`}>
          {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} color="#16a34a" />}
          <span>{notification.message}</span>
          <button className="btn-icon ml-auto" onClick={() => setNotification({ type: '', message: '' })}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="filter-controls-row">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by customer, appliance, technician, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-pill-filter">
          {['ALL', 'Pending', 'Assigned', 'Accepted', 'In Progress', 'Completed', 'Cancelled'].map(st => (
            <button
              key={st}
              className={`pill-btn ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="flex-center py-12">
          <div className="spinner"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state-box mt-6">
          <h4>No bookings matched your criteria</h4>
        </div>
      ) : (
        <div className="bookings-table-wrapper mt-6">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Appliance & Service</th>
                <th>Date & Slot</th>
                <th>Technician</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
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
                      <div>
                        <strong>{b.technician.name}</strong>
                        <div className="sub-text">{b.technician.phone}</div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAssignModalBooking(b);
                          setSelectedTechId(technicians[0]?._id || '');
                        }}
                        className="btn btn-warning btn-xs"
                      >
                        <UserCheck size={13} /> Assign Tech
                      </button>
                    )}
                  </td>
                  <td>
                    <BookingStatusBadge status={b.status} />
                  </td>
                  <td>
                    <div className="table-actions-group">
                      <button
                        title="View Full Details"
                        className="btn-icon"
                        onClick={() => setDetailsModalBooking(b)}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        title="Change Status"
                        className="btn-icon"
                        onClick={() => {
                          setStatusModalBooking(b);
                          setSelectedNewStatus(b.status);
                          setServiceNotes(b.serviceNotes || '');
                        }}
                      >
                        <Filter size={16} />
                      </button>

                      <button
                        title="Reassign Technician"
                        className="btn-icon"
                        onClick={() => {
                          setAssignModalBooking(b);
                          setSelectedTechId(b.technician?._id || technicians[0]?._id || '');
                        }}
                      >
                        <UserCheck size={16} />
                      </button>

                      <button
                        title="Delete Booking"
                        className="btn-icon text-danger"
                        onClick={() => handleDeleteBooking(b._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Technician Modal */}
      {assignModalBooking && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Assign Technician</h3>
            <p>Select a technician for order #{assignModalBooking._id.slice(-6).toUpperCase()} ({assignModalBooking.appliance?.name} - {assignModalBooking.service?.name})</p>

            <form onSubmit={handleAssignTechnician} className="custom-form mt-4">
              <div className="form-group">
                <label>Select Verified Technician</label>
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Technician --</option>
                  {technicians.map(t => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.phone || t.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions mt-6">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setAssignModalBooking(null)}
                  disabled={assigning}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={assigning}>
                  {assigning ? 'Assigning...' : 'Assign & Notify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {statusModalBooking && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Update Booking Status</h3>
            <p>Order #{statusModalBooking._id.slice(-6).toUpperCase()}</p>

            <form onSubmit={handleUpdateStatus} className="custom-form mt-4">
              <div className="form-group">
                <label>Select Status</label>
                <select
                  value={selectedNewStatus}
                  onChange={(e) => setSelectedNewStatus(e.target.value)}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Accepted">Accepted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label>Admin / Service Notes</label>
                <textarea
                  rows={3}
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                  placeholder="Additional service notes or dispatch remarks..."
                />
              </div>

              <div className="modal-actions mt-6">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStatusModalBooking(null)}
                  disabled={updatingStatus}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={updatingStatus}>
                  {updatingStatus ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {detailsModalBooking && (
        <div className="modal-backdrop">
          <div className="modal-card modal-lg">
            <div className="flex-between">
              <h3>Booking Details #{detailsModalBooking._id.toUpperCase()}</h3>
              <button className="btn-icon" onClick={() => setDetailsModalBooking(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="details-grid-layout mt-4">
              <div className="detail-section-box">
                <h4>Customer Info</h4>
                <div className="info-kv-row"><span>Name:</span> <strong>{detailsModalBooking.customer?.name}</strong></div>
                <div className="info-kv-row"><span>Email:</span> <span>{detailsModalBooking.customer?.email}</span></div>
                <div className="info-kv-row"><span>Phone:</span> <strong>{detailsModalBooking.phone}</strong></div>
                <div className="info-kv-row"><span>Address:</span> <span>{detailsModalBooking.address}</span></div>
              </div>

              <div className="detail-section-box">
                <h4>Appliance & Technician</h4>
                <div className="info-kv-row"><span>Appliance:</span> <strong>{detailsModalBooking.appliance?.name}</strong></div>
                <div className="info-kv-row"><span>Service:</span> <span>{detailsModalBooking.service?.name}</span></div>
                <div className="info-kv-row"><span>Fee:</span> <strong>${detailsModalBooking.service?.price}</strong></div>
                <div className="info-kv-row"><span>Technician:</span> <span>{detailsModalBooking.technician ? detailsModalBooking.technician.name : 'Unassigned'}</span></div>
              </div>
            </div>

            <div className="detail-section-box mt-4">
              <h4>Problem Description</h4>
              <p>{detailsModalBooking.problemDescription}</p>
              {detailsModalBooking.serviceNotes && (
                <div className="service-notes-box mt-3">
                  <strong>Notes:</strong> {detailsModalBooking.serviceNotes}
                </div>
              )}
            </div>

            <div className="modal-actions mt-6">
              <button className="btn btn-outline" onClick={() => setDetailsModalBooking(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookingsPage;

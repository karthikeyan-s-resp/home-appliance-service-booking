import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserCheck, Plus, Trash2, Mail, Phone, MapPin, AlertCircle, CheckCircle2, X } from 'lucide-react';

const ManageTechniciansPage = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTechnicians = async () => {
    try {
      const res = await api.get('/users/technicians');
      if (res.data.success) {
        setTechnicians(res.data.data);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to fetch technicians' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const handleCreateTechnician = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification({ type: '', message: '' });

    try {
      const res = await api.post('/users', {
        ...formData,
        role: 'technician'
      });
      if (res.data.success) {
        setNotification({ type: 'success', message: 'Technician account onboarded successfully!' });
        setModalOpen(false);
        setFormData({ name: '', email: '', password: '', phone: '', address: '' });
        fetchTechnicians();
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to create technician' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this technician account?')) {
      return;
    }

    try {
      const res = await api.delete(`/users/${id}`);
      if (res.data.success) {
        setNotification({ type: 'success', message: 'Technician account deleted' });
        setTechnicians(technicians.filter(t => t._id !== id));
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete technician' });
    }
  };

  return (
    <div className="manage-technicians-page">
      <div className="dashboard-header-bar">
        <div>
          <h2>Verified Technicians Network</h2>
          <p>Onboard qualified field repair technicians and monitor field assignments.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Technician</span>
        </button>
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

      {loading ? (
        <div className="flex-center py-12">
          <div className="spinner"></div>
        </div>
      ) : technicians.length === 0 ? (
        <div className="empty-state-box">
          <h4>No technicians found in the system</h4>
          <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-sm mt-3">
            Add First Technician
          </button>
        </div>
      ) : (
        <div className="bookings-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Technician Name</th>
                <th>Email Contact</th>
                <th>Phone Number</th>
                <th>Operational Base</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {technicians.map(t => (
                <tr key={t._id}>
                  <td>
                    <div className="flex-align gap-2">
                      <div className="tech-avatar-circle" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                        {t.name.charAt(0)}
                      </div>
                      <strong>{t.name}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="sub-text"><Mail size={12} /> {t.email}</div>
                  </td>
                  <td>
                    <div className="sub-text"><Phone size={12} /> {t.phone || 'N/A'}</div>
                  </td>
                  <td>
                    <div className="sub-text truncate" style={{ maxWidth: '250px' }}>
                      <MapPin size={12} /> {t.address || 'Field Tech'}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="btn-icon text-danger"
                      title="Delete Technician"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Onboard Technician Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="flex-between">
              <h3>Onboard New Technician</h3>
              <button className="btn-icon" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTechnician} className="custom-form mt-4">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Henderson (AC Specialist)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alex@fixpro.local"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Password (min 6 chars) *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 555-0155"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Service Area / Depot</label>
                  <input
                    type="text"
                    placeholder="e.g. Metro West Hub"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions mt-6">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Technician Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTechniciansPage;

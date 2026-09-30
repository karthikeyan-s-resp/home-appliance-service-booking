import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, Clock } from 'lucide-react';

const ManageServicesPage = () => {
  const [services, setServices] = useState([]);
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    appliance: '',
    name: '',
    description: '',
    price: 49,
    estimatedDuration: '1-2 hours',
    isActive: true
  });
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [servicesRes, appliancesRes] = await Promise.all([
        api.get('/services'),
        api.get('/appliances')
      ]);
      if (servicesRes.data.success) {
        setServices(servicesRes.data.data);
      }
      if (appliancesRes.data.success) {
        setAppliances(appliancesRes.data.data);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to fetch services' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      appliance: appliances[0]?._id || '',
      name: '',
      description: '',
      price: 49,
      estimatedDuration: '1-2 hours',
      isActive: true
    });
    setModalOpen(true);
  };

  const openEditModal = (srv) => {
    setEditingService(srv);
    setFormData({
      appliance: srv.appliance?._id || '',
      name: srv.name,
      description: srv.description || '',
      price: srv.price,
      estimatedDuration: srv.estimatedDuration || '1-2 hours',
      isActive: srv.isActive !== undefined ? srv.isActive : true
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification({ type: '', message: '' });

    try {
      if (editingService) {
        const res = await api.put(`/services/${editingService._id}`, formData);
        if (res.data.success) {
          setNotification({ type: 'success', message: 'Service updated successfully' });
        }
      } else {
        const res = await api.post('/services', formData);
        if (res.data.success) {
          setNotification({ type: 'success', message: 'Service package created successfully' });
        }
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service package?')) {
      return;
    }

    try {
      const res = await api.delete(`/services/${id}`);
      if (res.data.success) {
        setNotification({ type: 'success', message: 'Service deleted successfully' });
        setServices(services.filter(s => s._id !== id));
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete service' });
    }
  };

  return (
    <div className="manage-services-page">
      <div className="dashboard-header-bar">
        <div>
          <h2>Service Offerings & Pricing</h2>
          <p>Create and customize repair, tune-up, and diagnostic service packages.</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Service</span>
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
      ) : (
        <div className="bookings-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Appliance Category</th>
                <th>Pricing</th>
                <th>Est. Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(srv => (
                <tr key={srv._id}>
                  <td>
                    <strong>{srv.name}</strong>
                    <div className="sub-text truncate" style={{ maxWidth: '300px' }}>{srv.description}</div>
                  </td>
                  <td>
                    <span className="service-appliance-tag">{srv.appliance?.name || 'General'}</span>
                  </td>
                  <td>
                    <strong className="text-primary">${srv.price}</strong>
                  </td>
                  <td>
                    <span className="sub-text"><Clock size={12} /> {srv.estimatedDuration}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${srv.isActive ? 'active' : 'inactive'}`}>
                      {srv.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions-group">
                      <button onClick={() => openEditModal(srv)} className="btn-icon" title="Edit Service">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(srv._id)} className="btn-icon text-danger" title="Delete Service">
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

      {/* Modal Form */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="flex-between">
              <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              <button className="btn-icon" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="custom-form mt-4">
              <div className="form-group">
                <label>Appliance Category *</label>
                <select
                  required
                  value={formData.appliance}
                  onChange={(e) => setFormData({ ...formData, appliance: e.target.value })}
                >
                  <option value="">-- Choose Appliance --</option>
                  {appliances.map(app => (
                    <option key={app._id} value={app._id}>{app.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Service Package Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC Gas Refill, Drum Cleaning..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Standard Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Estimated Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.5 hours, 45 mins"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Package Description</label>
                <textarea
                  rows={3}
                  placeholder="What is included in this repair or servicing job..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active & available for customer bookings</span>
                </label>
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
                  {submitting ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServicesPage;

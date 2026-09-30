import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, Layers } from 'lucide-react';

const ManageAppliancesPage = () => {
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    icon: 'Wrench',
    isActive: true
  });
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchAppliances = async () => {
    try {
      const res = await api.get('/appliances');
      if (res.data.success) {
        setAppliances(res.data.data);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to load appliances' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliances();
  }, []);

  const openCreateModal = () => {
    setEditingAppliance(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      icon: 'Wrench',
      isActive: true
    });
    setModalOpen(true);
  };

  const openEditModal = (app) => {
    setEditingAppliance(app);
    setFormData({
      name: app.name,
      description: app.description || '',
      image: app.image || '',
      icon: app.icon || 'Wrench',
      isActive: app.isActive !== undefined ? app.isActive : true
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification({ type: '', message: '' });

    try {
      if (editingAppliance) {
        const res = await api.put(`/appliances/${editingAppliance._id}`, formData);
        if (res.data.success) {
          setNotification({ type: 'success', message: 'Appliance updated successfully' });
        }
      } else {
        const res = await api.post('/appliances', formData);
        if (res.data.success) {
          setNotification({ type: 'success', message: 'Appliance created successfully' });
        }
      }
      setModalOpen(false);
      fetchAppliances();
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deleting this appliance will also remove associated services. Are you sure?')) {
      return;
    }

    try {
      const res = await api.delete(`/appliances/${id}`);
      if (res.data.success) {
        setNotification({ type: 'success', message: 'Appliance and associated services deleted' });
        setAppliances(appliances.filter(a => a._id !== id));
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete appliance' });
    }
  };

  return (
    <div className="manage-appliances-page">
      <div className="dashboard-header-bar">
        <div>
          <h2>Appliance Categories</h2>
          <p>Add, edit, or configure home appliance categories offered on the platform.</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Appliance</span>
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
        <div className="admin-items-grid">
          {appliances.map(app => (
            <div key={app._id} className="admin-item-card">
              <div className="item-card-image">
                <img src={app.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'} alt={app.name} />
                <span className={`status-pill ${app.isActive ? 'active' : 'inactive'}`}>
                  {app.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="item-card-body">
                <h3>{app.name}</h3>
                <p>{app.description}</p>
                <div className="item-card-actions">
                  <button onClick={() => openEditModal(app)} className="btn btn-outline btn-xs">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(app._id)} className="btn btn-outline-danger btn-xs">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="flex-between">
              <h3>{editingAppliance ? 'Edit Appliance' : 'Add New Appliance'}</h3>
              <button className="btn-icon" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="custom-form mt-4">
              <div className="form-group">
                <label>Appliance Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dishwasher, Dehumidifier..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of appliance service coverage..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Icon Identifier</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                >
                  <option value="Wind">Wind (Air Conditioner)</option>
                  <option value="Refrigerator">Refrigerator</option>
                  <option value="RotateCw">RotateCw (Washing Machine)</option>
                  <option value="Tv">Tv (Television)</option>
                  <option value="Flame">Flame (Microwave)</option>
                  <option value="Droplets">Droplets (Water Heater)</option>
                  <option value="Cpu">Cpu (Smart & Other)</option>
                  <option value="Wrench">Wrench (General)</option>
                </select>
              </div>

              <div className="form-checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active & visible in customer booking catalog</span>
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
                  {submitting ? 'Saving...' : editingAppliance ? 'Update Appliance' : 'Create Appliance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAppliancesPage;

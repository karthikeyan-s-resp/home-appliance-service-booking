import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Trash2, Mail, Phone, MapPin, AlertCircle, CheckCircle2, X } from 'lucide-react';

const ManageCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/users?role=customer');
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to fetch customers' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer account?')) {
      return;
    }

    try {
      const res = await api.delete(`/users/${id}`);
      if (res.data.success) {
        setNotification({ type: 'success', message: 'Customer account deleted' });
        setCustomers(customers.filter(c => c._id !== id));
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete customer' });
    }
  };

  return (
    <div className="manage-customers-page">
      <div className="dashboard-header-bar">
        <div>
          <h2>Registered Customers</h2>
          <p>View registered customer accounts, contact directories, and default addresses.</p>
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

      {loading ? (
        <div className="flex-center py-12">
          <div className="spinner"></div>
        </div>
      ) : customers.length === 0 ? (
        <div className="empty-state-box">
          <h4>No customers registered yet</h4>
        </div>
      ) : (
        <div className="bookings-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Default Address</th>
                <th>Registered Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c._id}>
                  <td>
                    <strong>{c.name}</strong>
                  </td>
                  <td>
                    <div className="sub-text"><Mail size={12} /> {c.email}</div>
                  </td>
                  <td>
                    <div className="sub-text"><Phone size={12} /> {c.phone || 'N/A'}</div>
                  </td>
                  <td>
                    <div className="sub-text truncate" style={{ maxWidth: '250px' }}>
                      <MapPin size={12} /> {c.address || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <span className="sub-text">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="btn-icon text-danger"
                      title="Delete Customer Account"
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
    </div>
  );
};

export default ManageCustomersPage;

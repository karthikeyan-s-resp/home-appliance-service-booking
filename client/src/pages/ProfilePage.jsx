import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Phone, MapPin, Mail, Shield, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserData } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const payload = { name, phone, address };
      if (newPassword) payload.password = newPassword;

      const res = await api.put('/auth/profile', payload);
      if (res.data.success) {
        updateUserData(res.data.data);
        setSuccessMsg('Profile updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="dashboard-header-bar">
        <div>
          <h2>Account Profile & Settings</h2>
          <p>Update personal contact info, default service address, or change password.</p>
        </div>
      </div>

      {successMsg && (
        <div className="success-banner-box mb-6">
          <CheckCircle2 size={20} color="#16a34a" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert-danger mb-6">
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="profile-layout-grid">
        {/* Left summary card */}
        <div className="profile-summary-card">
          <div className="avatar-circle-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <h3>{user?.name}</h3>
          <p className="text-muted">{user?.email}</p>
          <span className={`role-badge role-${user?.role} mt-2`}>
            {user?.role?.toUpperCase()}
          </span>

          <div className="profile-meta-info mt-6">
            <div className="meta-row">
              <Mail size={16} /> <span>{user?.email}</span>
            </div>
            <div className="meta-row">
              <Phone size={16} /> <span>{user?.phone || 'No phone set'}</span>
            </div>
            <div className="meta-row">
              <MapPin size={16} /> <span>{user?.address || 'No address set'}</span>
            </div>
          </div>
        </div>

        {/* Right edit form */}
        <div className="profile-form-card">
          <form onSubmit={handleSubmit} className="custom-form">
            <h3>Update Profile Information</h3>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="input-disabled"
                  title="Email cannot be changed"
                />
                <small className="help-text">Email address is permanently associated with your account</small>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Service Address / Operations Base</label>
              <textarea
                rows={2}
                placeholder="Doorstep service location"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <hr className="divider my-6" />

            <h3>Change Password (optional)</h3>

            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions mt-6">
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(email, password);
      // Route based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'technician') {
        navigate('/technician/dashboard');
      } else {
        const redirectPath = location.state?.from?.pathname || '/customer/dashboard';
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your bookings, profile, or assigned jobs</p>
        </div>

        {error && (
          <div className="alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="custom-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full btn-lg"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="quick-demo-section mt-6">
          <div className="quick-demo-title">
            <Sparkles size={14} /> Quick Demo Logins:
          </div>
          <div className="quick-demo-buttons">
            <button
              type="button"
              className="quick-btn"
              onClick={() => handleQuickFill('customer@example.com', 'Customer@123')}
            >
              Customer
            </button>
            <button
              type="button"
              className="quick-btn"
              onClick={() => handleQuickFill('technician1@example.com', 'Admin@123')}
            >
              Technician
            </button>
            <button
              type="button"
              className="quick-btn"
              onClick={() => handleQuickFill('admin@example.com', 'Admin@123')}
            >
              Admin
            </button>
          </div>
        </div>

        <div className="auth-footer mt-6">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register as Customer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

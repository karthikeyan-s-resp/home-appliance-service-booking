import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Menu, X, User, LogOut, LayoutDashboard, Calendar, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isTechnician, isCustomer } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isTechnician) return '/technician/dashboard';
    return '/customer/dashboard';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand-logo">
          <div className="logo-icon-wrap">
            <Wrench size={22} className="brand-icon" />
          </div>
          <span className="brand-text">FixPro <span className="brand-sub">Appliances</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links desktop-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>

          {isAuthenticated ? (
            <div className="nav-auth-group">
              <Link to={getDashboardLink()} className="btn btn-outline btn-sm">
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>

              {isCustomer && (
                <Link to="/customer/book" className="btn btn-primary btn-sm">
                  <Calendar size={16} />
                  <span>Book Service</span>
                </Link>
              )}

              <div className="user-dropdown-info">
                <span className="user-name-tag">
                  {user.name.split(' ')[0]} 
                  <span className={`role-badge role-${user.role}`}>{user.role}</span>
                </span>
                <button onClick={handleLogout} className="btn-icon" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Links */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/services" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Services</Link>
          <Link to="/about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link to="/contact" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>

          <hr className="divider" />

          {isAuthenticated ? (
            <>
              <Link to={getDashboardLink()} className="mobile-link highlight" onClick={() => setMobileMenuOpen(false)}>
                Dashboard ({user.role})
              </Link>
              {isCustomer && (
                <Link to="/customer/book" className="mobile-link highlight" onClick={() => setMobileMenuOpen(false)}>
                  Book Service
                </Link>
              )}
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="mobile-logout-btn">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div className="mobile-auth-actions">
              <Link to="/login" className="btn btn-outline w-full" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              <Link to="/register" className="btn btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

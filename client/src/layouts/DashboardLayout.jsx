import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  Clock, 
  UserCheck, 
  Users, 
  Wrench, 
  Layers, 
  LogOut, 
  User,
  CheckCircle,
  FileText
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout, isAdmin, isTechnician, isCustomer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-shell">
      <Navbar />
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-user-panel">
            <div className="avatar-circle">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="sidebar-user-details">
              <strong>{user?.name}</strong>
              <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {/* Customer Links */}
            {isCustomer && (
              <>
                <NavLink to="/customer/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <LayoutDashboard size={18} />
                  <span>Overview</span>
                </NavLink>
                <NavLink to="/customer/book" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <CalendarPlus size={18} />
                  <span>Book a Service</span>
                </NavLink>
                <NavLink to="/customer/bookings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <Clock size={18} />
                  <span>My Bookings</span>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <User size={18} />
                  <span>My Profile</span>
                </NavLink>
              </>
            )}

            {/* Technician Links */}
            {isTechnician && (
              <>
                <NavLink to="/technician/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <LayoutDashboard size={18} />
                  <span>Technician Hub</span>
                </NavLink>
                <NavLink to="/technician/bookings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <FileText size={18} />
                  <span>Assigned Jobs</span>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <User size={18} />
                  <span>My Profile</span>
                </NavLink>
              </>
            )}

            {/* Admin Links */}
            {isAdmin && (
              <>
                <NavLink to="/admin/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <LayoutDashboard size={18} />
                  <span>Admin Overview</span>
                </NavLink>
                <NavLink to="/admin/bookings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <FileText size={18} />
                  <span>Manage Bookings</span>
                </NavLink>
                <NavLink to="/admin/appliances" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <Layers size={18} />
                  <span>Appliances</span>
                </NavLink>
                <NavLink to="/admin/services" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <Wrench size={18} />
                  <span>Services</span>
                </NavLink>
                <NavLink to="/admin/customers" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <Users size={18} />
                  <span>Customers</span>
                </NavLink>
                <NavLink to="/admin/technicians" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <UserCheck size={18} />
                  <span>Technicians</span>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <User size={18} />
                  <span>Profile</span>
                </NavLink>
              </>
            )}

            <button onClick={handleLogout} className="sidebar-link logout-link">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Dashboard Main View */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

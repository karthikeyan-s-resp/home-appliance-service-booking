import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BookServicePage from './pages/customer/BookServicePage';
import MyBookingsPage from './pages/customer/MyBookingsPage';
import BookingDetailsPage from './pages/customer/BookingDetailsPage';

// Technician Pages
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechnicianBookingsPage from './pages/technician/TechnicianBookingsPage';
import TechnicianBookingDetails from './pages/technician/TechnicianBookingDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';
import ManageAppliancesPage from './pages/admin/ManageAppliancesPage';
import ManageServicesPage from './pages/admin/ManageServicesPage';
import ManageCustomersPage from './pages/admin/ManageCustomersPage';
import ManageTechniciansPage from './pages/admin/ManageTechniciansPage';

// Protected Route Guard
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Pages inside Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Authenticated Dashboard Pages */}
      <Route element={<DashboardLayout />}>
        {/* Profile (any authenticated role) */}
        <Route element={<ProtectedRoute allowedRoles={['customer', 'technician', 'admin']} />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Customer Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/book" element={<BookServicePage />} />
          <Route path="/customer/bookings" element={<MyBookingsPage />} />
          <Route path="/customer/bookings/:id" element={<BookingDetailsPage />} />
        </Route>

        {/* Technician Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['technician']} />}>
          <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
          <Route path="/technician/bookings" element={<TechnicianBookingsPage />} />
          <Route path="/technician/bookings/:id" element={<TechnicianBookingDetails />} />
        </Route>

        {/* Admin Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<ManageBookingsPage />} />
          <Route path="/admin/appliances" element={<ManageAppliancesPage />} />
          <Route path="/admin/services" element={<ManageServicesPage />} />
          <Route path="/admin/customers" element={<ManageCustomersPage />} />
          <Route path="/admin/technicians" element={<ManageTechniciansPage />} />
        </Route>
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

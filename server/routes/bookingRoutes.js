const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  getTechnicianBookings,
  assignTechnician,
  updateBookingStatus,
  deleteBooking,
  getDashboardStats
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Specific paths first
router.get('/my', protect, authorize('customer'), getMyBookings);
router.get('/assigned/me', protect, authorize('technician'), getTechnicianBookings);
router.get('/stats/dashboard', protect, authorize('admin'), getDashboardStats);

// General collection routes
router.post('/', protect, authorize('customer', 'admin'), createBooking);
router.get('/', protect, authorize('admin'), getAllBookings);

// Individual booking routes
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/assign', protect, authorize('admin'), assignTechnician);
router.put('/:id/status', protect, authorize('admin', 'technician'), updateBookingStatus);
router.delete('/:id', protect, authorize('admin'), deleteBooking);

module.exports = router;

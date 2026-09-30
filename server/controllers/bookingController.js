const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Appliance = require('../models/Appliance');
const User = require('../models/User');

// Allowed status transitions logic
const VALID_TRANSITIONS = {
  'Pending': ['Assigned', 'Cancelled'],
  'Assigned': ['Accepted', 'Cancelled', 'Pending'],
  'Accepted': ['In Progress', 'Cancelled'],
  'In Progress': ['Completed', 'Cancelled'],
  'Completed': [],
  'Cancelled': []
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = async (req, res) => {
  try {
    const {
      appliance,
      service,
      problemDescription,
      preferredDate,
      preferredTime,
      address,
      phone
    } = req.body;

    if (!appliance || !service || !problemDescription || !preferredDate || !preferredTime || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: appliance, service, problemDescription, preferredDate, preferredTime, address, phone'
      });
    }

    // Verify service and appliance
    const appExists = await Appliance.findById(appliance);
    if (!appExists) {
      return res.status(404).json({ success: false, message: 'Appliance not found' });
    }

    const srvExists = await Service.findById(service);
    if (!srvExists) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const booking = await Booking.create({
      customer: req.user._id,
      appliance,
      service,
      problemDescription,
      preferredDate,
      preferredTime,
      address,
      phone,
      status: 'Pending'
    });

    const populated = await Booking.findById(booking._id)
      .populate('customer', 'name email phone address')
      .populate('technician', 'name email phone')
      .populate('appliance', 'name image icon')
      .populate('service', 'name price estimatedDuration');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in customer's bookings
// @route   GET /api/bookings/my
// @access  Private (Customer)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('appliance', 'name image icon')
      .populate('service', 'name price estimatedDuration')
      .populate('technician', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (Customer, Assigned Technician, Admin)
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('technician', 'name email phone')
      .populate('appliance', 'name image icon')
      .populate('service', 'name price estimatedDuration');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Role check: customer can only view own booking; technician can only view assigned booking; admin can view any
    if (req.user.role === 'customer' && booking.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    if (req.user.role === 'technician' && (!booking.technician || booking.technician._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel pending booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer or Admin)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Customers can only cancel their own bookings and only if status is 'Pending' or 'Assigned'
    if (req.user.role === 'customer') {
      if (booking.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
      }
      if (booking.status !== 'Pending' && booking.status !== 'Assigned') {
        return res.status(400).json({
          success: false,
          message: `Cannot cancel booking currently in '${booking.status}' status. Only Pending or Assigned bookings can be cancelled.`
        });
      }
    }

    booking.status = 'Cancelled';
    if (req.body.serviceNotes) {
      booking.serviceNotes = (booking.serviceNotes ? booking.serviceNotes + ' | ' : '') + `Cancelled: ${req.body.serviceNotes}`;
    }
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('customer', 'name email phone address')
      .populate('technician', 'name email phone')
      .populate('appliance', 'name image icon')
      .populate('service', 'name price estimatedDuration');

    res.json({ success: true, message: 'Booking cancelled successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (with optional status/technician filter)
// @route   GET /api/bookings
// @access  Private (Admin)
const getAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.technician) {
      filter.technician = req.query.technician;
    }

    const bookings = await Booking.find(filter)
      .populate('customer', 'name email phone address')
      .populate('technician', 'name email phone')
      .populate('appliance', 'name image icon')
      .populate('service', 'name price estimatedDuration')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings assigned to logged-in technician
// @route   GET /api/bookings/assigned/me
// @access  Private (Technician)
const getTechnicianBookings = async (req, res) => {
  try {
    const filter = { technician: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const bookings = await Booking.find(filter)
      .populate('customer', 'name email phone address')
      .populate('appliance', 'name image icon')
      .populate('service', 'name price estimatedDuration')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign technician to booking
// @route   PUT /api/bookings/:id/assign
// @access  Private (Admin)
const assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;
    if (!technicianId) {
      return res.status(400).json({ success: false, message: 'Please provide technicianId' });
    }

    const technician = await User.findOne({ _id: technicianId, role: 'technician' });
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.technician = technician._id;
    booking.status = 'Assigned';
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('customer', 'name email phone address')
      .populate('technician', 'name email phone')
      .populate('appliance', 'name image icon')
      .populate('service', 'name price estimatedDuration');

    res.json({ success: true, message: 'Technician assigned successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status & service notes
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin or Assigned Technician)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, serviceNotes } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Role authorization
    if (req.user.role === 'technician') {
      if (!booking.technician || booking.technician.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized for this booking' });
      }

      // Technicians can update: Assigned -> Accepted -> In Progress -> Completed
      const allowedTechnicianTransitions = {
        'Assigned': ['Accepted'],
        'Accepted': ['In Progress'],
        'In Progress': ['Completed']
      };

      if (status && (!allowedTechnicianTransitions[booking.status] || !allowedTechnicianTransitions[booking.status].includes(status))) {
        return res.status(400).json({
          success: false,
          message: `Cannot transition from '${booking.status}' to '${status}'. Allowed: ${allowedTechnicianTransitions[booking.status]?.join(', ') || 'None'}`
        });
      }
    }

    if (status) {
      booking.status = status;
    }
    if (serviceNotes !== undefined) {
      booking.serviceNotes = serviceNotes;
    }

    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('customer', 'name email phone address')
      .populate('technician', 'name email phone')
      .populate('appliance', 'name image icon')
      .populate('service', 'name price estimatedDuration');

    res.json({ success: true, message: 'Booking updated successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await booking.deleteOne();
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard metrics
// @route   GET /api/bookings/stats/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalTechnicians = await User.countDocuments({ role: 'technician' });
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const completedBookings = await Booking.countDocuments({ status: 'Completed' });
    const inProgressBookings = await Booking.countDocuments({ status: 'In Progress' });
    const assignedBookings = await Booking.countDocuments({ status: 'Assigned' });
    const acceptedBookings = await Booking.countDocuments({ status: 'Accepted' });

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalTechnicians,
        totalBookings,
        pendingBookings,
        completedBookings,
        inProgressBookings,
        assignedBookings,
        acceptedBookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};

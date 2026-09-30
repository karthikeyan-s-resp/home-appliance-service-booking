const Service = require('../models/Service');
const Appliance = require('../models/Appliance');

// @desc    Get all services (optional query param ?appliance=id)
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const filter = {};
    if (req.query.appliance) {
      filter.appliance = req.query.appliance;
    }
    if (req.query.active === 'true') {
      filter.isActive = true;
    }

    const services = await Service.find(filter)
      .populate('appliance', 'name image icon')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('appliance', 'name image icon');
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Admin)
const createService = async (req, res) => {
  try {
    const { appliance, name, description, price, estimatedDuration, isActive } = req.body;

    if (!appliance || !name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide appliance ID, name, and price' });
    }

    // Verify appliance exists
    const appExists = await Appliance.findById(appliance);
    if (!appExists) {
      return res.status(404).json({ success: false, message: 'Appliance category does not exist' });
    }

    const service = await Service.create({
      appliance,
      name,
      description: description || '',
      price: Number(price),
      estimatedDuration: estimatedDuration || '1-2 hours',
      isActive: isActive !== undefined ? isActive : true
    });

    const populated = await Service.findById(service._id).populate('appliance', 'name image');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin)
const updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (req.body.price !== undefined) {
      req.body.price = Number(req.body.price);
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('appliance', 'name image');

    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await service.deleteOne();
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};

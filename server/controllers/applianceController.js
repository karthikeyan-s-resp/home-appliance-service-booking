const Appliance = require('../models/Appliance');
const Service = require('../models/Service');

// @desc    Get all appliances
// @route   GET /api/appliances
// @access  Public
const getAppliances = async (req, res) => {
  try {
    const appliances = await Appliance.find().sort({ createdAt: -1 });
    res.json({ success: true, count: appliances.length, data: appliances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single appliance
// @route   GET /api/appliances/:id
// @access  Public
const getApplianceById = async (req, res) => {
  try {
    const appliance = await Appliance.findById(req.params.id);
    if (!appliance) {
      return res.status(404).json({ success: false, message: 'Appliance not found' });
    }
    res.json({ success: true, data: appliance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new appliance
// @route   POST /api/appliances
// @access  Private (Admin)
const createAppliance = async (req, res) => {
  try {
    const { name, description, image, icon, isActive } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide appliance name' });
    }

    const existing = await Appliance.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Appliance with this name already exists' });
    }

    const appliance = await Appliance.create({
      name,
      description: description || '',
      image: image || '',
      icon: icon || 'Wrench',
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({ success: true, data: appliance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appliance
// @route   PUT /api/appliances/:id
// @access  Private (Admin)
const updateAppliance = async (req, res) => {
  try {
    let appliance = await Appliance.findById(req.params.id);
    if (!appliance) {
      return res.status(404).json({ success: false, message: 'Appliance not found' });
    }

    appliance = await Appliance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: appliance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete appliance
// @route   DELETE /api/appliances/:id
// @access  Private (Admin)
const deleteAppliance = async (req, res) => {
  try {
    const appliance = await Appliance.findById(req.params.id);
    if (!appliance) {
      return res.status(404).json({ success: false, message: 'Appliance not found' });
    }

    // Also delete or deactivate associated services
    await Service.deleteMany({ appliance: appliance._id });
    await appliance.deleteOne();

    res.json({ success: true, message: 'Appliance and associated services deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAppliances,
  getApplianceById,
  createAppliance,
  updateAppliance,
  deleteAppliance
};

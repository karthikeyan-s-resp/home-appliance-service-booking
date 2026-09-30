const express = require('express');
const router = express.Router();
const {
  getAppliances,
  getApplianceById,
  createAppliance,
  updateAppliance,
  deleteAppliance
} = require('../controllers/applianceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAppliances);
router.get('/:id', getApplianceById);
router.post('/', protect, authorize('admin'), createAppliance);
router.put('/:id', protect, authorize('admin'), updateAppliance);
router.delete('/:id', protect, authorize('admin'), deleteAppliance);

module.exports = router;

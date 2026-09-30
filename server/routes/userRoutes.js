const express = require('express');
const router = express.Router();
const {
  getUsers,
  getTechnicians,
  createUser,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin'), getUsers);
router.get('/technicians', protect, authorize('admin', 'customer'), getTechnicians);
router.post('/', protect, authorize('admin'), createUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', authorize('admin'), getAllUsers);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createTask,
  getUserTasks,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Apply protect middleware to all routes
router.use(protect);

// Get dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

// Create task
router.post('/', createTask);

// Get all tasks for logged-in user
router.get('/', getUserTasks);

// Get tasks for a specific project
router.get('/project/:projectId', getProjectTasks);

// Get single task by ID
router.get('/:taskId', getTaskById);

// Update task
router.put('/:taskId', updateTask);

// Delete task
router.delete('/:taskId', deleteTask);

module.exports = router;

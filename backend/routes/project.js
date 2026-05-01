const express = require('express');
const router = express.Router();
const {
  createProject,
  addTeamMembers,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Apply protect middleware to all routes
router.use(protect);

// Create project (Admin only)
router.post('/', authorize('admin'), createProject);

// Get all projects for logged-in user
router.get('/', getUserProjects);

// Get single project by ID
router.get('/:projectId', getProjectById);

// Add team members to project
router.put('/:projectId/add-members', addTeamMembers);

// Update project
router.put('/:projectId', updateProject);

// Delete project
router.delete('/:projectId', deleteProject);

module.exports = router;

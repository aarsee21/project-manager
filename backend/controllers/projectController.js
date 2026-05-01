const Project = require('../models/project');
const User = require('../models/user');

// @desc    Create a new project (Admin only)
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a project name'
      });
    }

    // Create project
    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      teamMembers: [req.user._id] // Add creator as team member
    });

    // Populate references
    await project.populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'teamMembers', select: 'name email role' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add team members to a project
// @route   PUT /api/projects/:projectId/add-members
// @access  Private/Admin
exports.addTeamMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userIds } = req.body;

    // Validation
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of user IDs'
      });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the project creator (admin for this project)
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project creator can add team members'
      });
    }

    // Verify users exist
    const users = await User.find({ _id: { $in: userIds } });
    if (users.length !== userIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more users not found'
      });
    }

    // Add members to project
    userIds.forEach(userId => {
      if (!project.teamMembers.includes(userId)) {
        project.teamMembers.push(userId);
      }
    });

    await project.save();

    // Populate references
    await project.populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'teamMembers', select: 'name email role' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Team members added successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all projects for logged-in user
// @route   GET /api/projects
// @access  Private
exports.getUserProjects = async (req, res) => {
  try {
    // Get all projects where user is a team member
    const projects = await Project.find({
      teamMembers: req.user._id
    })
      .populate('createdBy', 'name email')
      .populate('teamMembers', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:projectId
// @access  Private
exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate('createdBy', 'name email')
      .populate('teamMembers', 'name email role');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is a team member
    if (!project.teamMembers.some(member => member._id.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this project'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:projectId
// @access  Private/Admin
exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;

    let project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the project creator
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project creator can update this project'
      });
    }

    project = await Project.findByIdAndUpdate(
      projectId,
      { name, description },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('teamMembers', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:projectId
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the project creator
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project creator can delete this project'
      });
    }

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

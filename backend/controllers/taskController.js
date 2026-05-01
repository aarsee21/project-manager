const Task = require('../models/task');
const Project = require('../models/project');

// @desc    Create a task under a project
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    // Validation
    if (!title || !projectId || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, projectId, and assignedTo'
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

    // Check if user is a team member of the project
    if (!project.teamMembers.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this project'
      });
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      dueDate,
      createdBy: req.user._id
    });

    // Populate references
    await task.populate([
      { path: 'projectId', select: 'name' },
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get tasks for a specific project
// @route   GET /api/tasks/project/:projectId
// @access  Private
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is a team member
    if (!project.teamMembers.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this project'
      });
    }

    const tasks = await Task.find({ projectId })
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:taskId
// @access  Private
exports.getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is assigned to the task or is a project team member
    const project = await Project.findById(task.projectId);
    if (!project.teamMembers.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this task'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:taskId
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, assignedTo, dueDate } = req.body;

    let task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is assigned to task or is project creator
    const project = await Project.findById(task.projectId);
    const isAssigned = task.assignedTo.toString() === req.user._id.toString();
    const isProjectCreator = project.createdBy.toString() === req.user._id.toString();

    if (!isAssigned && !isProjectCreator) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this task'
      });
    }

    // Update task
    task = await Task.findByIdAndUpdate(
      taskId,
      {
        title: title || task.title,
        description: description || task.description,
        status: status || task.status,
        assignedTo: assignedTo || task.assignedTo,
        dueDate: dueDate || task.dueDate
      },
      { new: true, runValidators: true }
    )
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:taskId
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is project creator
    const project = await Project.findById(task.projectId);
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project creator can delete tasks'
      });
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard statistics for logged-in user
// @route   GET /api/tasks/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Get all tasks assigned to user
    const totalTasks = await Task.countDocuments({ assignedTo: userId });

    // Get completed tasks
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: 'completed'
    });

    // Get pending tasks
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: 'pending'
    });

    // Get in-progress tasks
    const inProgressTasks = await Task.countDocuments({
      assignedTo: userId,
      status: 'in-progress'
    });

    // Get overdue tasks (due date is past and status is not completed)
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: 'completed' },
      dueDate: { $lt: now }
    });

    // Get tasks due this week
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dueThisWeek = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: 'completed' },
      dueDate: { $gte: now, $lte: weekFromNow }
    });

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
        dueThisWeek,
        completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

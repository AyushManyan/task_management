const express = require('express');
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const dashboardController = require('../controllers/dashboardController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  createProjectValidator,
  updateProjectValidator,
} = require('../validators/projectValidator');
const {
  createTaskValidator,
  updateTaskValidator,
  updateTaskStatusValidator,
} = require('../validators/taskValidator');

const router = express.Router();

// Project routes
router.post('/projects', protect, isAdmin, createProjectValidator, projectController.createProject);
router.get('/projects', protect, projectController.getProjects);
// Admin: get all projects
router.get('/projects/all', protect, isAdmin, projectController.getAllProjects);
router.get('/projects/progress', protect, projectController.getProjectsProgress);
router.get('/projects/:id', protect, projectController.getProjectById);
router.put('/projects/:id', protect, isAdmin, updateProjectValidator, projectController.updateProject);
router.delete('/projects/:id', protect, isAdmin, projectController.deleteProject);
router.post('/projects/:id/assign', protect, isAdmin, projectController.assignMembers);

// Task routes
router.post('/tasks', protect, isAdmin, createTaskValidator, taskController.createTask);
router.get('/tasks', protect, taskController.getTasks);
router.get('/tasks/:id', protect, taskController.getTaskById);
router.put('/tasks/:id', protect, isAdmin, updateTaskValidator, taskController.updateTask);
router.delete('/tasks/:id', protect, isAdmin, taskController.deleteTask);
router.post('/tasks/:id/assign', protect, isAdmin, taskController.assignTask);
router.patch('/tasks/:id/status', protect, updateTaskStatusValidator, taskController.updateTaskStatus);

// Dashboard
router.get('/dashboard', protect, dashboardController.getDashboard);

module.exports = router;

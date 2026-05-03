const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const { title, description, project, assignedTo, deadline } = req.body;

    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(400).json({ msg: 'Project does not exist' });
    }

    if (assignedTo) {
      const isMember = existingProject.members.some(
        (m) => m.toString() === assignedTo
      );
      if (!isMember) {
        return res.status(400).json({ msg: 'Assigned user is not a member of this project' });
      }
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      deadline,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;

    if (req.user.role === 'Admin') {
      if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    } else {
      filter.assignedTo = req.user.id;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    // Only update fields that are explicitly provided
    const allowedFields = ['title', 'description', 'status', 'assignedTo', 'deadline', 'project'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const task = await Task.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true })
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (!assignedTo) {
      task.assignedTo = null;
      await task.save();
      const updatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name email')
        .populate('project', 'name');
      return res.json(updatedTask);
    }

    const targetUser = await User.findById(assignedTo);
    if (!targetUser) {
      return res.status(400).json({ msg: 'Assigned user does not exist' });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(400).json({ msg: 'Project does not exist' });
    }

    const isMember = project.members.some((memberId) => memberId.toString() === assignedTo);
    if (!isMember) {
      return res.status(400).json({ msg: 'Assigned user is not a member of this project' });
    }

    task.assignedTo = assignedTo;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (!task.assignedTo || req.user.id !== task.assignedTo.toString()) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const { status } = req.body;
    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

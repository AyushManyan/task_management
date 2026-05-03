// Get all projects (admin only)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).populate('members', 'name email role');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const { name, description, members } = req.body;
    const project = await Project.create({
      name,
      description,
      members,
      createdBy: req.user.id,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user.id },
        { members: req.user.id },
      ],
    }).populate('members', 'name email role');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name email role');
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    if (
      project.createdBy.toString() !== req.user.id &&
      !project.members.some((m) => m._id.toString() === req.user.id)
    ) {
      return res.status(403).json({ msg: 'Forbidden' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (req.user.id !== project.createdBy.toString()) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (req.user.id !== project.createdBy.toString()) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getProjectsProgress = async (req, res) => {
  try {
    const result = await Task.aggregate([
      {
        $group: {
          _id: "$project",
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
          },
        },
      },
    ]);
    const progress = result.map((item) => ({
      projectId: item._id,
      total: item.total,
      completed: item.completed,
    }));
    res.json(progress);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.assignMembers = async (req, res) => {
  try {
    const { members } = req.body; // array of user IDs
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: { $each: members } } },
      { new: true }
    ).populate('members', 'name email role');
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

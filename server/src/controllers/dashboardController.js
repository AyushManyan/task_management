const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const now = new Date();
    if (userRole === 'Admin') {
      // Admin: show project statistics (task breakdown for all projects)
      const now = new Date();
      const projects = await Project.find({});
      const projectIds = projects.map(p => p._id);
      const tasks = await Task.find({ project: { $in: projectIds } });
      const total = projects.length;
      // Aggregate task stats for all projects
      const completed = tasks.filter((t) => t.status === 'Completed').length;
      const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
      const pending = tasks.filter((t) => t.status === 'Pending').length;
      const overdue = tasks.filter((t) => t.deadline && t.deadline < now && t.status !== 'Completed').length;
      res.json({ total, completed, inProgress, pending, overdue });
    } else {
      // Member: show task statistics and number of projects involved in (as member or creator)
      const tasks = await Task.find({ assignedTo: userId });
      const total = tasks.length;
      const completed = tasks.filter((t) => t.status === 'Completed').length;
      const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
      const pending = tasks.filter((t) => t.status === 'Pending').length;
      const overdue = tasks.filter((t) => t.deadline && t.deadline < now && t.status !== 'Completed').length;
      // Count all projects where user is member or creator
      const projects = await Project.find({ $or: [ { members: userId }, { createdBy: userId } ] });
      const projectCount = projects.length;
      res.json({ total, completed, inProgress, pending, overdue, projectCount });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

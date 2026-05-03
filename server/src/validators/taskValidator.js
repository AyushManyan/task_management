const { body } = require("express-validator");

exports.createTaskValidator = [
  body("title")
    .notEmpty()
    .withMessage("Task title is required"),
  body("project")
    .notEmpty()
    .withMessage("Project is required")
    .isMongoId()
    .withMessage("Project must be a valid ObjectId"),
  body("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("assignedTo must be a valid ObjectId"),
  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be one of: Pending, In Progress, Completed"),
];

exports.updateTaskValidator = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Task title cannot be empty"),
  body("project")
    .optional()
    .isMongoId()
    .withMessage("Project must be a valid ObjectId"),
  body("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("assignedTo must be a valid ObjectId"),
  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be one of: Pending, In Progress, Completed"),
];

exports.updateTaskStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be one of: Pending, In Progress, Completed"),
];

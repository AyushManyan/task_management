const { body } = require("express-validator");

exports.createProjectValidator = [
  body("name")
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ max: 100 })
    .withMessage("Project name must not exceed 100 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

exports.updateProjectValidator = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Project name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Project name must not exceed 100 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

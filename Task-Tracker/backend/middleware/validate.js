// backend/middleware/validate.js
const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/ErrorResponse');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new ErrorResponse(errorMessages, 400));
  }
  next();
};

exports.validateTask = [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('tags', 'At least one tag is required').isArray({ min: 1 }),
  this.validate,
];
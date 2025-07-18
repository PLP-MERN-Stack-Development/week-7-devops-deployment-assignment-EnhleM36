// backend/controllers/uploadController.js
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Task = require('../models/Task');
const cloudinary = require('../utils/cloudinary');

// @desc    Upload file for task
// @route   PUT /api/v1/tasks/:id/upload
// @access  Private
exports.uploadFile = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is task owner
  if (task.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this task`,
        401
      )
    );
  }

  if (!req.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const attachment = {
    url: req.file.path,
    publicId: req.file.filename,
    filename: req.file.originalname
  };

  task.attachments.push(attachment);
  await task.save();

  res.status(200).json({
    success: true,
    data: attachment
  });
});

// @desc    Delete file from task
// @route   DELETE /api/v1/tasks/:id/upload/:fileId
// @access  Private
exports.deleteFile = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is task owner
  if (task.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this task`,
        401
      )
    );
  }

  // Find the attachment
  const attachmentIndex = task.attachments.findIndex(
    att => att._id.toString() === req.params.fileId
  );

  if (attachmentIndex === -1) {
    return next(
      new ErrorResponse(`File not found with id of ${req.params.fileId}`, 404)
    );
  }

  const attachment = task.attachments[attachmentIndex];

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(attachment.publicId);

  // Remove from array
  task.attachments.splice(attachmentIndex, 1);
  await task.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});
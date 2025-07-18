// backend/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authController = require('../controllers/authController');
const uploadController = require('../controllers/uploadController');
const upload = require('../utils/cloudinary');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */

router.use(authController.protect);

router
  .route('/')
  .get(taskController.getTasks)
  .post(
    taskController.validateTask,
    taskController.createTask
  );

router
  .route('/:id')
  .get(taskController.getTask)
  .put(
    taskController.validateTask,
    taskController.checkTaskOwnership,
    taskController.updateTask
  )
  .delete(
    taskController.checkTaskOwnership,
    taskController.deleteTask
  );

router
  .route('/:id/upload')
  .put(
    taskController.checkTaskOwnership,
    upload.single('file'),
    uploadController.uploadFile
  );

router
  .route('/:id/upload/:fileId')
  .delete(
    taskController.checkTaskOwnership,
    uploadController.deleteFile
  );

module.exports = router;
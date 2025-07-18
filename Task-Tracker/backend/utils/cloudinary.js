// backend/utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { CLOUDINARY } = require('../config/env');

cloudinary.config({
  cloud_name: CLOUDINARY.cloud_name,
  api_key: CLOUDINARY.api_key,
  api_secret: CLOUDINARY.api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'task-tracker',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'pdf', 'doc', 'docx'],
    resource_type: 'auto',
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx)$/)) {
      return cb(new Error('Only image, PDF and Word files are allowed!'), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
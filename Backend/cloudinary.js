const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
cloudinary.video("intersection_aerial", {transformation: [
    {width: 1000, crop: "scale"},
    {quality: "auto"},
    {fetch_format: "auto"}
]});
cloudinary.image("landmannalaugar_iceland.jpg", {transformation: [
    {width: 1000, crop: "scale"},
    {quality: "auto"},
    {fetch_format: "auto"}
]});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'posts',
    resource_type: 'auto', // This allows both image and video uploads
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp4', 'mov', 'avi', 'webm'] // Add video formats
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit file size to 10MB
  }
});

module.exports = upload;
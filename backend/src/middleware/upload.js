const path = require('path');
const multer = require('multer');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const imageTypes = /image\/(jpeg|png|gif|webp)/;
  const videoTypes = /video\/(mp4|webm|quicktime)/;
  if (imageTypes.test(file.mimetype) || videoTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, png, gif, webp) and videos (mp4, webm, mov) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

module.exports = upload;

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.resolve(__dirname, "../../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const hardwareVideosDir = path.resolve(__dirname, "../../public/assets/hardware_videos");
if (!fs.existsSync(hardwareVideosDir)) {
  fs.mkdirSync(hardwareVideosDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${Date.now()}_${baseName}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg|bmp|pdf|mp4|webm|ogg|ogv|mov|quicktime|mkv|m4v|avi|3gp|flv|wmv/i;
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    const mime = file.mimetype.toLowerCase();

    if (allowed.test(ext) || mime.startsWith("image/") || mime.startsWith("video/") || mime === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error(`File type .${ext} is not supported. Please upload an image, PDF, or video file.`));
    }
  },
});

// Middleware wrapper that gracefully catches Multer errors
exports.uploadMiddleware = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "File is too large. Maximum allowed size is 500MB." });
      }
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message || "Failed to upload file" });
    }
    next();
  });
};

exports.handleUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({
    success: true,
    message: "File uploaded successfully",
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
};

// Scan public/assets/hardware_videos and public/uploads for existing video assets
exports.getAvailableVideos = (req, res) => {
  try {
    const videos = [];
    const videoExts = [".mp4", ".webm", ".ogg", ".mov", ".mkv", ".m4v", ".avi"];

    // 1. Scan hardware_videos folder
    if (fs.existsSync(hardwareVideosDir)) {
      const hwFiles = fs.readdirSync(hardwareVideosDir);
      hwFiles.forEach((file) => {
        const ext = path.extname(file).toLowerCase();
        if (videoExts.includes(ext)) {
          const stats = fs.statSync(path.join(hardwareVideosDir, file));
          videos.push({
            name: file,
            label: `Hardware Video: ${file}`,
            url: `/assets/hardware_videos/${file}`,
            folder: "hardware_videos",
            size: stats.size,
          });
        }
      });
    }

    // 2. Scan uploads folder for videos
    if (fs.existsSync(uploadsDir)) {
      const uploadFiles = fs.readdirSync(uploadsDir);
      uploadFiles.forEach((file) => {
        const ext = path.extname(file).toLowerCase();
        if (videoExts.includes(ext)) {
          const stats = fs.statSync(path.join(uploadsDir, file));
          videos.push({
            name: file,
            label: `Uploaded: ${file}`,
            url: `/uploads/${file}`,
            folder: "uploads",
            size: stats.size,
          });
        }
      });
    }

    return res.json({
      success: true,
      data: videos,
    });
  } catch (err) {
    console.error("Error reading video directory:", err);
    return res.status(500).json({ success: false, message: "Failed to list video assets" });
  }
};

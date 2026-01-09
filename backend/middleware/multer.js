import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log('File field name:', file.fieldname);
    console.log('File mimetype:', file.mimetype);
    
    // Accept image files from 'image' (single) or 'images' (multiple) fields
    if ((file.fieldname === 'image' || file.fieldname === 'images') && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error(`Unexpected field: ${file.fieldname}`), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  }
});

export default upload;

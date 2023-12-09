import multer from 'multer';
import path from 'path';
const lecture = multer({
  dest: "lecture/",
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 mb in size max limit
  storage: multer.diskStorage({
    destination: "lecture/",
    filename: (_req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
  }),
  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp" &&
      ext !== ".png" &&
      ext !== ".mp4"
    ) {
      cb(new Error(`Unsupported file type! ${ext}`), false);
      return;
    }

    cb(null, true);
  },
});

export default lecture;


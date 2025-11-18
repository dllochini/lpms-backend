import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = "./uploads";

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export const uploadFields = upload.fields([
  { name: "farmerPhoto", maxCount: 1 },
  { name: "landPhoto", maxCount: 1 },
  { name: "documents", maxCount: 10 },
  { name: "signedAgreement", maxCount: 1 },
]);

export default upload;

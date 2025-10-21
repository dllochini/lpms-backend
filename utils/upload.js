// src/utils/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = "./uploads";

// ensure upload dir exists
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

/**
 * uploadFields: the fields we expect from the frontend
 * - farmerPhoto: single
 * - landPhoto: single
 * - documents: multiple
 * - signedAgreement: single
 */
export const uploadFields = upload.fields([
  { name: "farmerPhoto", maxCount: 1 },
  { name: "landPhoto", maxCount: 1 },
  { name: "documents", maxCount: 10 }, // increase as needed
  { name: "signedAgreement", maxCount: 1 },
]);

// helper if you need upload.none() or single field middlewares
export default upload;

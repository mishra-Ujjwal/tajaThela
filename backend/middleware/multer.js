import multer from "multer";

// store files temporarily in 'public' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public"); // ensure folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // unique file name
  },
});

const upload = multer({ storage });
export default upload;

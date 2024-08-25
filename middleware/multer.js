// import multer from "multer";

// const storage = multer.memoryStorage();
// export const singleUpload = multer({ storage }).single("file");

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const singleUpload = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
]);

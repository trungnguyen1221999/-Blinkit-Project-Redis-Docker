import upload from "./multer.js";

export const uploadSingleImage = (fieldName) => upload.single(fieldName);

export const uploadMultipleImages = (fieldName, maxCount = 10) =>
  upload.array(fieldName, maxCount);

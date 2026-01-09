import cloudinary from "../config/cloudinaryConfig.js";

const uploadImageCloudinary = async (image) => {
  const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

  return await new Promise((resolve, reject) =>
    cloudinary.uploader
      .upload_stream({ folder: "binkeyit" }, (err, result) =>
        err ? reject(err) : resolve(result)
      )
      .end(buffer)
  );
};

export default uploadImageCloudinary;

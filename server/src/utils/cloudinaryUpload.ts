import cloudinary from "../config/cloudinary.js";

export const uploadImage = (
  buffer: Buffer,
  folder: string,
  publicId?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    ).end(buffer);
  });
};

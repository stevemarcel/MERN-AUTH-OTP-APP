import cloudinary from "../config/cloudinary.js";

// Upload a profile image buffer to Cloudinary
export const uploadProfileImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "mern-auth-otp-app/profiles",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(buffer);
  });
};

// Delete a profile image from Cloudinary
export const deleteProfileImageFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });

    console.log(`Cloudinary image deleted: ${publicId}`);
  } catch (error) {
    console.error(`Failed to delete Cloudinary image '${publicId}':`, error);
  }
};

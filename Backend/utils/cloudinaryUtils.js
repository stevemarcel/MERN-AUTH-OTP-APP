import cloudinary from "../config/cloudinary.js";

// !============================================================
// !GENERIC IMAGE UPLOAD
// !============================================================

export const uploadImageToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          // Delivery-time optimization:
          // - width: 1200px maximum
          // - q_auto: automatic quality/compression
          // - f_auto: automatic browser-supported format
          const optimizedUrl = cloudinary.url(result.public_id, {
            secure: true,
            transformation: [
              {
                width: 1200,
                crop: "limit",
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          });

          resolve({
            ...result,
            optimized_url: optimizedUrl,
          });
        },
      )
      .end(buffer);
  });
};

// !============================================================
// !GENERIC IMAGE DELETE
// !============================================================

export const deleteImageFromCloudinary = async (publicId) => {
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

// !============================================================
// !USER PROFILE IMAGE
// !============================================================

export const uploadProfileImageToCloudinary = (buffer) => {
  return uploadImageToCloudinary(buffer, "mern-auth-otp-app/profiles");
};

export const deleteProfileImageFromCloudinary = (publicId) => {
  return deleteImageFromCloudinary(publicId);
};

// !============================================================
// !PRODUCT IMAGE
// !============================================================

export const uploadProductImageToCloudinary = (buffer) => {
  return uploadImageToCloudinary(buffer, "mern-auth-otp-app/products");
};

export const deleteProductImageFromCloudinary = (publicId) => {
  return deleteImageFromCloudinary(publicId);
};

const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImageToCloudinary = async (profile) => {
  try {
    if (!profile) return "File not found";

    const response = await cloudinary.uploader.upload(profile, {
      resource_type: "image" 
    });

    console.log("Image successfully uploaded to Cloudinary", response.secure_url);

    fs.unlinkSync(profile);

    return response;

  } catch (error) {
    if (fs.existsSync(profile)) fs.unlinkSync(profile); 
    console.log("Cloudinary image upload error", error);
    return null;
  }
};

module.exports = { uploadImageToCloudinary };
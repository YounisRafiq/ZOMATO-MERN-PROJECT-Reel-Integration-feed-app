const cloudinary = require('cloudinary').v2;
const fs = require('fs');

  cloudinary.config({
    cloud_name :process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
  });

  const uploadOnCloundinary = async (video) => {
     try {
      if(!video) return "File is NOT Found";

    const response = await cloudinary.uploader.upload(video , {
       resource_type : "video"
     });
     console.log("File is SuccessFully Upload on Cloundinary" , response.url);
     fs.unlinkSync(video)
     return response;

     } catch (error) {
      fs.unlinkSync(video)
      console.log("Cloundinary Upload Error" , error);
      return null;
     }
  }



module.exports = {uploadOnCloundinary};
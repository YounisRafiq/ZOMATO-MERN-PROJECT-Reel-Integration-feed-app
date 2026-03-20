const foodModel = require("../models/food.model.js");
const storageService = require("../services/storage.services.js");
const { v4: uuid } = require("uuid");


async function createFood(req, res) {
  console.log("FoodPartner" , req.foodPartner);
  const uploadImagetoCloudinary = await storageService.uploadOnCloundinary(req.file.path , uuid());

   console.log("File" , req.file.path);

  console.log(uploadImagetoCloudinary , "Image Upload Compeleted");
   
  const foodItem = await foodModel.create({
     name : req.body.name,
     description : req.body.description,
     video : uploadImagetoCloudinary.url,
     foodPartner : req.foodPartner._id
  });

  res.status(201).json({
    message : "Food Item created SuccessFully",
    foodItem : foodItem
  })
}

async function getfoodReel(req , res) {
   const foodItem = await foodModel.find({});
   res.status(200).json({
    message : "Food Items fetched SuccessFully",
    foodItem
   })
};

module.exports = {
  createFood,
  getfoodReel
};

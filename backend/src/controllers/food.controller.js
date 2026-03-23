const foodModel = require("../models/food.model.js");
const storageService = require("../services/storage.services.js");
const likeModel = require("../models/likes.model.js");
const saveFood = require("../models/save.food.js");
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

async function likedReel(req , res){
  const { foodId } = req.body;

  const user = req.user;
  
  const isAlreadyLiked = await likeModel.findOne({
    user : user._id,
    food : foodId
  });

  await foodModel.findByIdAndUpdate(foodId , {
    $inc : { likeCount : -1 }
  })

  if(isAlreadyLiked){
    await likeModel.findOneAndDelete({
      user : user._id,
      food : foodId
    });

    return res.status(200).json({
      message : "Food Reel Unliked SuccessFully"
    });
  };

   const like = await likeModel.create({
    user : user._id,
    food : foodId
   });

    await foodModel.findByIdAndUpdate(foodId , {
      $inc : { likeCount : 1 }
    })

   res.status(201).json({
    message : "Food Reel Liked SuccessFully",
    like
   });
}

async function saveFoodReel(req , res) {
   const { foodId } = req.body;
   const user = req.user;

   const isAlredySaved = await saveFood.findOne({
    user : user._id,
    food : foodId
   });

   if(isAlredySaved){
    await saveFood.findOneAndDelete({
       user : user._id,
       food : foodId
    });

    return res.status(200).json({
       message : "Food Reel unSaved SuccessFully"
    })
   };

   const save = await saveFood.create({
    user : user._id,
    food : foodId
   });

   res.status(200).json({
    message : "Food Saved SuccessFully"
   });


}

module.exports = {
  createFood,
  getfoodReel,
  likedReel,
  saveFoodReel
};

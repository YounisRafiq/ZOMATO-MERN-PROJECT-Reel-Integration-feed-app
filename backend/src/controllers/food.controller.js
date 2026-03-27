const Food = require("../models/food.model.js");
const storageService = require("../services/storage.services.js");
const likeModel = require("../models/likes.model.js");
const saveFood = require("../models/save.food.js");
const { v4: uuid } = require("uuid");


async function createFood(req, res) {
  console.log("FoodPartner" , req.foodPartner);
  const uploadImagetoCloudinary = await storageService.uploadOnCloundinary(req.file.path , uuid());

   console.log("File" , req.file.path);

  console.log(uploadImagetoCloudinary , "Image Upload Compeleted");
   
  const foodItem = await Food.create({
     name : req.body.name,
     description : req.body.description,
     video : uploadImagetoCloudinary.url,
     foodPartner : req.foodPartner._id
  });

   console.log(foodItem);

  res.status(201).json({
    message : "Food Item created SuccessFully",
    foodItem : foodItem
  })
}

async function getFoodReel(req, res) {
  try {
    const allFoods = await Food.find().populate("foodPartner" , "name").sort({ createdAt: -1 });

    res.status(200).json({
      message: "Food Reels Fetched Successfully",
      data: allFoods
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
}

async function likedReel(req , res){
  const { foodId } = req.body;

  if(!req.user){
    return res.status(404).json({
      message : "User NOT found"
    })
  };
  const user = req.user;
  
  const isAlreadyLiked = await likeModel.findOne({
    user : user._id,
    food : foodId
  });

  if(isAlreadyLiked){
    await likeModel.findOneAndDelete({
      user : user._id,
      food : foodId
    });
    await Food.findByIdAndUpdate(foodId , {
      $inc : { likeCount : -1 }
    });
    return res.status(200).json({
      message : "Food Reel Unliked SuccessFully"
    });
  };

   const like = await likeModel.create({
    user : user._id,
    food : foodId
   });

    await Food.findByIdAndUpdate(foodId , {
      $inc : { likeCount : 1 }
    })

   res.status(201).json({
    message : "Food Reel Liked SuccessFully",
    like
   });
}

async function saveFoodReel(req , res) {
   const { foodId } = req.body;

      
 if (!req.user) {
     return res.status(401).json({
       message: "User not authenticated"
     });
   }

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
    await Food.findByIdAndUpdate(foodId, { $inc: { saveCount: -1 } });
    return res.status(200).json({
       message : "Food Reel unSaved SuccessFully"
    })
   };

   const save = await saveFood.create({
    user : user._id,
    food : foodId
   });
   await Food.findByIdAndUpdate(foodId, { $inc: { saveCount : 1 } });

   res.status(200).json({
    message : "Food Saved SuccessFully",
    save
   });
}

async function commentReel(req, res) {
  const { foodId } = req.body;
  const user = req.user;

  if(!user){
    return res.status(404).json({
      message : "User NOT found"
    })
  }

  await Food.findByIdAndUpdate(foodId, { $inc: { commentCount: 1 } });

  res.status(200).json({
    message: "Comment added successfully"
  });
}

async function getSavedFoods(req, res) {
  try {

   if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const user = req.user;
    const savedItems = await saveFood.find({ user: user._id }).populate('food');
    
    // Populate counts for each saved food
    for (let item of savedItems) {
      const food = item.food;
      const likeCount = await likeModel.countDocuments({ food: food._id });
      const saveCount = await saveFood.countDocuments({ food: food._id });
      const commentCount = food.commentCount || 0;
      
      food.likeCount = likeCount;
      food.saveCount = saveCount;
      food.commentCount = commentCount;
    }

    res.status(200).json({
      message: "Saved foods fetched successfully",
      data: savedItems.map(item => item.food)
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
}

module.exports = {
  createFood,
  getFoodReel,
  likedReel,
  saveFoodReel,
  commentReel,
  getSavedFoods
};


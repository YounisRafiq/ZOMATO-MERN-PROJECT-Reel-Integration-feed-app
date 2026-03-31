const mongoose = require("mongoose");
const Food = require("../models/food.model.js");
const storageService = require("../services/storage.services.js");
const likeModel = require("../models/likes.model.js");
const saveFood = require("../models/save.food.js");
const { v4: uuidv4 } = require("uuid");

async function createFood(req, res) {
  console.log("FoodPartner", req.foodPartner);
  const uploadImagetoCloudinary = await storageService.uploadOnCloundinary(
    req.file.path,
    uuidv4(),
  );

  console.log("File", req.file.path);

  console.log(uploadImagetoCloudinary, "Image Upload Compeleted");

  const foodItem = await Food.create({
    name: req.body.name,
    description: req.body.description,
    video: uploadImagetoCloudinary.url,
    foodPartner: req.foodPartner._id,
  });

  console.log(foodItem);

  res.status(201).json({
    message: "Video created SuccessFully",
    foodItem: foodItem,
  });
}

async function getFoodReel(req, res) {
  try {
    const allFoods = await Food.find()
      .populate("foodPartner", "name profile")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Videos Fetched Successfully",
      data: allFoods,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
}

async function likedReel(req, res) {
  try {
    const { foodId } = req.body;
    const foodPartner = req.foodPartner;

    // 🔒 Auth check
    if (!foodPartner) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated User",
      });
    }

    // 🔍 Validate food
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    const query = {
      foodPartner: foodPartner._id,
      food: foodId,
    };

    // ⚡ Atomic toggle (optimized)
    const deleted = await likeModel.findOneAndDelete(query);

    let likeChange;
    let isLiked;

    if (deleted) {
      // 🔴 UNLIKE
      likeChange = -1;
      isLiked = false;
    } else {
      // 🟢 LIKE
      await likeModel.create(query);
      likeChange = 1;
      isLiked = true;
    }

    // 🔄 Update like count
    const updatedFood = await Food.findByIdAndUpdate(
      foodId,
      { $inc: { likeCount: likeChange } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: isLiked ? "Liked" : "Unliked",
      likeCount: updatedFood.likeCount,
      isLiked: isLiked,
    });

  } catch (error) {
    console.error("Like Toggle Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

async function saveFoodReel(req, res) {
  try {
    const { foodId } = req.body;

    if (!req.foodPartner) {
      return res.status(401).json({
        message: "Food Partner NOT Authenticated",
      });
    }

    if (!foodId) {
      return res.status(400).json({
        message: "Food ID is required",
      });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    const foodPartner = req.foodPartner;

    const isAlreadySaved = await saveFood.findOne({
      foodPartner: foodPartner._id,
      food: foodId,
    });

    if (isAlreadySaved) {
      await saveFood.findOneAndDelete({
        foodPartner: foodPartner._id,
        food: foodId,
      });

      const updatedFood = await Food.findByIdAndUpdate(
        foodId,
        { $inc: { saveCount: -1 } },
        { new: true }
      );

      return res.status(200).json({
        message: "Food Reel Unsaved Successfully",
        isSaved: false,
        saveCount: updatedFood.saveCount,
      });
    }

    const save = await saveFood.create({
      foodPartner: foodPartner._id,
      food: foodId,
    });

    const updatedFood = await Food.findByIdAndUpdate(
      foodId,
      { $inc: { saveCount: 1 } },
      { new: true }
    );

    return res.status(200).json({
      message: "Food Saved Successfully",
      isSaved: true,
      saveCount: updatedFood.saveCount,
      save,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
}

async function commentReel(req, res) {
  const { foodId } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(404).json({
      message: "User NOT found",
    });
  }

  await Food.findByIdAndUpdate(foodId, { $inc: { commentCount: 1 } });

  res.status(200).json({
    message: "Comment added successfully",
  });
}

async function getSavedFoods(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const user = req.user;
    const savedItems = await saveFood.find({ user: user._id }).populate("food");

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
      data: savedItems.map((item) => item.food),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
}

module.exports = {
  createFood,
  getFoodReel,
  likedReel,
  saveFoodReel,
  commentReel,
  getSavedFoods,
};

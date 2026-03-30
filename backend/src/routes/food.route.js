const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food.controller.js')
const authMidlleware = require('../middlewares/auth.middleware.js');
const upload = require("../middlewares/multer.middleware.js");

router.post(
  '/', authMidlleware.authFoodPartnerMiddleware, upload.single("video"), foodController.createFood                                   
);
router.get(
  '/' , 
   foodController.getFoodReel);

   router.post(
    "/like" , authMidlleware.authFoodPartnerMiddleware , foodController.likedReel
  );

  router.post("/save", authMidlleware.authUserMiddleware , foodController.saveFoodReel);
  router.get("/save", authMidlleware.authUserMiddleware , foodController.getSavedFoods);
  router.post("/comment", authMidlleware.authUserMiddleware , foodController.commentReel);
  

module.exports = router;

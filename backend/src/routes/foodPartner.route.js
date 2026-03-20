const express = require('express');
const router = express.Router();
const authMidlleware = require('../middlewares/auth.middleware');
const FoodPartnerUserController = require('../controllers/foodPartnerUser.controller');

router.get("/:id", authMidlleware.authFoodPartnerMiddleware , FoodPartnerUserController.getfoodPartnerById)

module.exports = router;
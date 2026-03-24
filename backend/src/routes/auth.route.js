const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const upload2 = require("../middlewares/multer2.middleware");

// User Auth Routes
router.post('/user/register', authController.registerUser);
router.post('/user/login' , authController.loginUser);
router.get('/user/logout' , authController.logoutUser);

// Food Partner Auth Routes
router.post('/food-partner/register', upload2.single("profile") , authController.registerFoodPartner);
router.post('/food-partner/login', authController.loginFoodPartner);
router.get('/food-partner/logout', authController.logoutFoodPartner);

module.exports = router;

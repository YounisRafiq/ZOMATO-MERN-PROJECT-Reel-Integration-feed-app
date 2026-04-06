const jwt = require('jsonwebtoken');
const foodPartnerModel = require('../models/foodPartner.model');
const userModel = require('../models/user.model');

async function authFoodPartnerMiddleware(req, res, next) {
  const token = req.cookies.token;
  console.log("Token in Food Partner Middleware:", token);

  if (!token) {
    console.log("❌ No token found in cookies");
    return res.status(401).json({
      message: "Please Login First",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
    const foodPartner = await foodPartnerModel.findById(decoded._id);

    if (!foodPartner) {
      console.log("❌ Food Partner not found for ID:", decoded._id);
      return res.status(401).json({
        message: "Food Partner not found",
      });
    }

    req.foodPartner = foodPartner;

    next();

  } catch (error) {
    console.log("❌ JWT Error:", error.message);

    return res.status(401).json({
      message: "Invalid Token",
    });
  }
}

async function authUserMiddleware(req , res , next){
        const token = req.cookies?.token;

       console.log("Token" , token);

       console.log("Cookies:", req.cookies);

    if(!token){
        return res.status(401).json({
            message : "Please Login First"
        })
    };

    try {
       const decoded = jwt.verify(token , process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
      const user = await userModel.findById(decoded._id);
       console.log("User in auth middleware" , user);
      if(!user){
        return res.status(404).json({
            message : "User NOT Found"
        })
      }
      req.user = user;

       next();

    } catch (error) {
        return res.status(401).json({
            message : "Invalid Token",
        })
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
}
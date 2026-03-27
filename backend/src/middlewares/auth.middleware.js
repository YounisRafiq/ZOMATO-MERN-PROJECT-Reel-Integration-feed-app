const jwt = require('jsonwebtoken');
const foodPartnerModel = require('../models/foodPartner.model');
const userModel = require('../models/user.model');

async function authFoodPartnerMiddleware(req ,res , next) {
    const token = req.cookies.token;
    
    console.log("Token" , token)
    if(!token){
        return res.status(401).json({
            message : "Please Login First"
        })
    };

    try {
       const decoded = jwt.verify(token , process.env.JWT_SECRET);
       
       console.log("Decoded" , decoded)

      const foodPartner = await foodPartnerModel.findById(decoded._id);

      if (!foodPartner) {
  return res.status(401).json({
    message: "Food Partner not found"
  });
}
      req.foodPartner = foodPartner;
      next();

    } catch (error) {
        return res.status(401).json({
            message : "Invalid Token",
        })
    }
};

async function authUserMiddleware(req , res , next){
        const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message : "Please Login First"
        })
    };

    try {
       const decoded = jwt.verify(token , process.env.JWT_SECRET);

      const user = await userModel.findById(decoded._id);

      if(!user){
        return res.status(404).json({
            message : "User NOT Found"
        })
      }
      req.user = user;
      console.log("User :" , user);

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
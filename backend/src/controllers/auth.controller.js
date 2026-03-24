const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const foodPartnerModel = require('../models/foodPartner.model.js');
const storageService = require("../services/storage.services2.js");

  async function registerUser (req , res) {
  const { fullName , email , password } = req.body;

  const isUserAlreadyExist = await User.findOne({
    email
  });

  if(isUserAlreadyExist){
    return res.status(400).json({
      message : "user already exist"
    });
  };

  if(email === "" || password === ""){
    return res.status(400).json({
      message : "Email & Password aren't empty"
    })
  }

  const hashedPassword = await bcrypt.hash(password , 10);

  const user = await User.create({
    fullName,
    email,
    password : hashedPassword
  });


  if(!user){
    return res.status(400).json({
      message : "Invalid email or password"
    })
  };

  const token = jwt.sign({
    id : user._id,
  } , process.env.JWT_SECRET);

  res.cookie("token" , token);
  
  res.status(201).json({
    message : "User registered SuccessFully",
    user : {
      id : user._id,
      fullName : user.fullName,
      email : user.email,
    }
  })
};

async function loginUser(req , res) {
  const { email , password } = req.body;

  if(email === "" || password === ""){
    return res.status(400).json({
      message : "Email and Password aren't empty"
    })
  };

  const user = await User.findOne({email});
  if(!user){
    return res.status(400).json({
      message : "Email NOT Found"
    });
  };

  const isPasswordvalid =  bcrypt.compare(password , user.password);

  if(!isPasswordvalid){
    return res.status(400).json({
      message : "Password doesn't match"
    });
  }

  const token = jwt.sign({
     id : user._id
  } , process.env.JWT_SECRET);

  if(!token){
    return res.status(500).json({
      message : "Failed to create token"
    })
  };

  res.cookie("token" , token);

  res.status(200).json({
    message : "User loggedIn SuccessFully",
    user : {
      id : user._id,
      email : user.email,
      fullName : user.fullName
    }
  })
}

async function logoutUser(req ,res){
  res.clearCookie("token");
  res.status(200).json({
    message : "User Logout SuccessFully"
  })
}

async function registerFoodPartner(req , res) {
   const { email , name , password  , phone , address , contactName} = req.body;

   console.log(req.file);
   const isAccountExist = await foodPartnerModel.findOne({
    email
   });

   if(isAccountExist){
    res.status(400).json({
      message : "foodPartner account alreadt exist"
    })
   };

   if(!req.file){
    return res.status(401).json({
      message : "Profile Image is required"
    })
   };

   const result = await storageService.uploadImageToCloudinary(req.file.path);

   const hashedPassword = await bcrypt.hash(password , 10);

   const foodPartner = await foodPartnerModel.create({
    email,
    name,
    password : hashedPassword,
    phone,
    address,
    contactName,
    profile : result.secure_url
   });

   if(!foodPartner){
    return res.status(400).json({
      message : "Invalid email or password"
    });
   }

   const token = jwt.sign({
    _id : foodPartner._id
   } , process.env.JWT_SECRET);

   if(!token){
    return res.status(500).json({
      message : "Failed to create token"
    })
   };

   res.cookie("token" , token);

   res.status(200).json({
    message : "foodPartner registered successfully",
    foodPartner : {
      name : foodPartner.name,
      email : foodPartner.email,
      _id : foodPartner._id,
      address : foodPartner.address,
      phone : foodPartner.phone,
      contactName : foodPartner.contactName,
      profile : foodPartner.profile
    }
   })
}

async function loginFoodPartner(req , res) {
  const { email , password } = req.body;

   const foodPartner = await foodPartnerModel.findOne({
    email
   });

   if(!foodPartner){
    return res.status(400).json({
      message : "Invalid email or password"
    })
   };

   const isPasswordValid= await bcrypt.compare(password , foodPartner.password);


   if(!isPasswordValid){
    return res.status(400).json({
      message : "Invalid email or password"
    })
   };

   const token = jwt.sign({
    _id : foodPartner._id
   } , process.env.JWT_SECRET);

   if(!token){
    return res.status(500).json({
      message : "Failed to create token"
    })
   };

   res.cookie("token", token);

   res.status(201).json({
    message : "FoodPartner loggedIn SuccessFully",
    foodPartnerUser : {
      _id : foodPartner._id,
      name : foodPartner.name,
      email : foodPartner.email
    }
   });
}

async function logoutFoodPartner(req , res) {
  res.clearCookie("token");
  res.status(200).json({
    message : "Food Partner loggedOut SuccessFully"
  })
}




module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner
}
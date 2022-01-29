const express = require("express");
const User = require("../modules/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { findOneAndDelete, findOne } = require("../modules/User");
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
const fetchUser=require("../middleware/fetchUser")

const JWT_SECRET='Asmitis%op';

//Create a user using : POST "/api/auth/createuser". No login required
router.post( "/createuser", [
    body("name", "Please enter a valid name").isLength({ min: 3 }),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Passsword must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false
    //If there are errors, then return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    try {
      //Check whether the user with the same email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,error: "Sorry, a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data={
          user:{
              id:user.id
          }
      }
      const authtoken=jwt.sign(data,JWT_SECRET);

      //   res.json(user);
      success=true
    res.json({success,authtoken})
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//Authenticate a user using : POST "/api/auth/login". No login required
router.post( "/login", [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Passsword cannot be blank").exists(),
  ],  async (req, res) => {
    let success=false;
    //If there are errors, then return bad request and errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  const {email,password}=req.body;
  try {
    let user= await User.findOne({email});
    if(!user){
      success=false;
         return res.status(400).json({error:"Please login with correct credentials"});
    }  
  
    const passwordCompare= await bcrypt.compare(password,user.password);
    if(!passwordCompare){
        success=false;
         return res.status(400).json({success,error:"Please login with correct credentials"});
    }

    const data={
        user:{
            id:user.id
        }
    }
    const authtoken=jwt.sign(data,JWT_SECRET);
    success=true;
    res.json({success,authtoken})

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }

})

//Get  logged in user details using : POST "/api/auth/getuser". Login required
router.post( "/getuser",fetchUser, async(req,res)=>{
  try {
      userid=req.user.id;
      const user=await User.findById(userid).select("-password")
      res.send(user)
      
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");   
  }
})

module.exports = router;

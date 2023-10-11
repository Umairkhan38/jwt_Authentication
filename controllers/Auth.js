const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();


exports.signup = async (req,res)=>{

    try {
        const {name, email, password, role} = req.body;
        
        // check the user exist or not?
        const existingUser = await User.findOne({email});

        if(existingUser){
             return res.status(400).json({
                success:false,
                message:"User Already Exist",
            })
        }

        //hash the password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10)
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:"error in hasing password"
            })
        }
    
        //inserting an entry in a database
        const user = await User.create({
            name,email,password:hashedPassword,role
        })

        res.status(200).json({
            success:true,
            message:"data inserted Successfully!",
            user
        })

    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"User Can't be Registered!"
        })        
    }

}



//login controller
exports.login= async(req,res)=>{

    try{
        const {email, password} = req.body;
        
        //request without email or password
        if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"Provide all Details!!"
            })
        }
        
        //check user registred or not
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered!"
            })
        }
        
        const payload = {
            email:user.email,
            id:user._id,
            role:user.role
        }
        
        const isMatching = await bcrypt.compare(password, user.password);
        
        
        //verify that password is correct or not??
        if(isMatching){
            //creating a token
            let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"2h"});
            
            //inserting a token into a user object 
            user = user.toObject();
            user.token = token;

             //removing a password from user object
            user.password = undefined; 

            const options = {
                expires : new Date(Date.now() + 3 * 24 * 60* 60 * 1000),
                httpOnly:true
            }

            //sending cookie of token in response 
            res.cookie("token",token, options).status(200).json({
                success:true,
                token,
                user,
                message:"User LoggedIn Successfully!"
            })

        }else{
            return res.status(403).json({
                success:false,
                message:"Invalid Credentials!"
            })
        }
    }

    catch(err){
          console.log(err)  
          res.status(500).json({
            success:false,
            message:"login failed!"
          })

    }

}
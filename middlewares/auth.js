const jwt = require('jsonwebtoken');
require('dotenv').config();



exports.auth = async (req, res, next)=>{
    
    try{
        //extracting token from body
        const token = req.body.token;

        if(!token){
            res.status(401).json({
                success:false,
                message:"Token is Missing!"

                })
        }

        //verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            //here we are storing a payload info (email, id, role)
            req.user = decode;

        }catch(err){
          return res.status(401).json({
                success:false,
                message:"token is invalid!"
            })
        }
        next();

    } catch(err){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verifying token!"
        })

    }


}



exports.isStudent = (req, res, next)=>{

    try{    
        if(req.user.role !== 'Student'){
            return res.status(401).json({
                success:false,
                message:"this is protected route for student!"
            })
        }

        next();

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"User role is not Matching!"
        })
    }

}


exports.isAdmin = (req, res, next)=>{

    try{    
        if(req.user.role !== 'Admin'){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Admin!"
            })
        }

        next();

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"User role is not Matching!"
        })
    }

}
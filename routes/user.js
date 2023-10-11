const express = require('express');
const router = express.Router();
const {login, signup} = require('../controllers/Auth');
const {auth, isStudent, isAdmin} = require('../middlewares/auth') 


router.post('/signup', signup)
router.post('/login', login)

//protected routes
router.get('/student', auth, isStudent,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"welcome to student routes"
    })
});

router.get('/admin', auth, isAdmin,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"welcome to Admin routes"
    })
});


module.exports = router;


const express = require('express');
const router = express.Router();
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/ExpressError");

router.get("/register",(req,res)=>{
    res.render('user/register');
})

router.post("/register",catchAsync(async(req,res)=>{
    try{
        const{username,email,password} = req.body;
        const user = new User({username:username,email:email});
        const newUser = await User.register(user,password);
        req.flash('success','Welcome to YelpCamp!');
        res.redirect('/campgrounds');
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}))

module.exports = router;
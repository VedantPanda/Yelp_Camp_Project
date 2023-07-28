const express = require('express');
const router = express.Router();
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/ExpressError");
const passport = require('passport');
const {login} = require('./middleware');

router.get("/register",login,(req,res)=>{
    res.render('user/register');
})

router.post("/register",login,catchAsync(async(req,res)=>{
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

router.get("/login",login,(req,res)=>{
    res.render("user/login");
})

router.post("/login",login,passport.authenticate('local',{failureFlash:true,failureRedirect:"/login"}),async(req,res)=>{
    req.flash('success','Welcome back!');
    res.redirect('/campgrounds');
})

module.exports = router;
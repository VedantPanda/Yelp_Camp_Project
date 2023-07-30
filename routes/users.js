const express = require('express');
const router = express.Router();
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/ExpressError");
const passport = require('passport');
const {login,storeReturnTo} = require('./middleware');

router.get("/register",login,(req,res)=>{
    res.render('user/register');
})

router.post("/register",login,catchAsync(async(req,res)=>{
    try{
        const{username,email,password} = req.body;
        const user = new User({username:username,email:email});
        const newUser = await User.register(user,password);
        req.login(newUser, err => {
            if(err){
                return next(err);
            }
            req.flash('success','Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}))

router.get("/login",login,(req,res)=>{
    res.render("user/login");
})

router.post("/login",storeReturnTo,login,passport.authenticate('local',{failureFlash:true,failureRedirect:"/login"}),async(req,res)=>{
    req.flash('success','Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 

module.exports = router;
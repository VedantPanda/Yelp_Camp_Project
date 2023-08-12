const express = require('express');
const router = express.Router();
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/ExpressError");
const passport = require('passport');
const {login,storeReturnTo} = require('../middleware');
const users = require('../controllers/users');

router.get("/register",login,users.registerForm);

router.post("/register",login,catchAsync(users.registerUser));

router.get("/login",login,users.loginForm);

router.post("/login",storeReturnTo,login,passport.authenticate('local',{failureFlash:true,failureRedirect:"/login"}),users.loginUser);

router.get('/logout', users.logoutUser); 

module.exports = router;
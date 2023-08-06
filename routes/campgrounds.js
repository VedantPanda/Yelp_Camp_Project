const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campGrounds');
const ExpressError = require("../utils/ExpressError");
const {campgroundSchema} = require('../validateSchemas');
const {isLoggedIn} = require('../routes/middleware');

const validateCampground = (req,res,next) => {
    const{error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(msg,404);
    }
    else{
        next();
    }
}

//Renders all the campgrounds
router.get("/", catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render("campground/index",{campgrounds});
}))

//Route to add new campground
router.get("/new",isLoggedIn, (req,res)=>{
    res.render("campground/new");
})

//Route to edit existing campground
router.get("/edit/:id", isLoggedIn, catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash("error","Campground does not exist");
        res.redirect("/campgrounds");
    }
    res.render("campground/edit",{campground});
}))

//Storing the data of the newly created campground in the database
router.post("/", isLoggedIn, validateCampground, catchAsync(async(req,res)=>{
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success','Successfully made a new campground!');
    res.redirect(`/campgrounds/show/${newCampground.id}`);
}))

//Showing the details of the specific campground
router.get("/show/:id", catchAsync(async(req,res)=>{
    const {id} = req.params;
    //console.log(id);
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    //console.log(campground);
    if(!campground){
        req.flash("error","Cannot find campground");
        res.redirect("/campgrounds");
    }
    //console.log(campground);
    res.render("campground/show",{campground});
}))

//Route to delete an existing campground
router.delete("/delete/:id", isLoggedIn, catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success","Campground deleted successfully!");
    res.redirect("/campgrounds");
}))

//Stores the edited data into the database
router.put("/edit/:id", isLoggedIn, validateCampground, catchAsync(async(req,res)=>{
    const{id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,req.body.campground,{new:true,runValidators:true});
    req.flash("success","Successfully updated campground!")
    res.redirect(`/campgrounds/show/${campground.id}`);
}))

module.exports = router;
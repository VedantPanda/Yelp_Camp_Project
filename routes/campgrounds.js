const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campGrounds');
const {validateCampground} = require('../middleware');
const {isLoggedIn,isAuthorized} = require('../middleware');

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
router.get("/edit/:id", isLoggedIn, isAuthorized, catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
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
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }
    ).populate('author');
    //console.log(campground);
    if(!campground){
        req.flash("error","Cannot find campground");
        res.redirect("/campgrounds");
    }
    //console.log(campground);
    res.render("campground/show",{campground});
}))

//Route to delete an existing campground
router.delete("/delete/:id", isLoggedIn, isAuthorized, catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success","Campground deleted successfully!");
    res.redirect("/campgrounds");
}))

//Stores the edited data into the database
router.put("/edit/:id", isLoggedIn, isAuthorized, validateCampground, catchAsync(async(req,res)=>{
    const{id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,req.body.campground,{new:true,runValidators:true});
    req.flash("success","Successfully updated campground!");
    res.redirect(`/campgrounds/show/${id}`);
}))

module.exports = router;
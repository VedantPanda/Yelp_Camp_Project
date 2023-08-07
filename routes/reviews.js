const express= require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/ExpressError");
const Campground = require('../models/campGrounds');
const Review = require('../models/reviews');
const {validateReview} = require('./middleware');
const {isLoggedIn} = require('./middleware');

router.post("/", isLoggedIn, validateReview, catchAsync(async(req,res)=>{
    const{id} = req.params;
    const review = new Review(req.body.review);
    const campground = await Campground.findById(id);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success","Review added successfully!");
    res.redirect(`/campgrounds/show/${campground.id}`);
}))

router.delete("/:reviewId",isLoggedIn, catchAsync(async(req,res)=>{
    const campgroundId = req.params.id;
    const {reviewId} = req.params;
    await Campground.findByIdAndUpdate(campgroundId,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully!");
    res.redirect(`/campgrounds/show/${campgroundId}`);
}))

module.exports = router;
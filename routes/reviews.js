const express= require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/ExpressError");
const Campground = require('../models/campGrounds');
const Review = require('../models/reviews');
const {reviewSchema} = require('../validateSchemas');

const validateReview = (req,res,next) => {
    const{error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg,404);
    }
    else{
        next();
    }
}

router.post("/", validateReview, catchAsync(async(req,res)=>{
    const{id} = req.params;
    const review = new Review(req.body.review);
    const campground = await Campground.findById(id);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success","Review added successfully!");
    res.redirect(`/campgrounds/show/${campground.id}`);
}))

router.delete("/:reviewId",catchAsync(async(req,res)=>{
    const campgroundId = req.params.id;
    const {reviewId} = req.params;
    await Campground.findByIdAndUpdate(campgroundId,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully!");
    res.redirect(`/campgrounds/show/${campgroundId}`);
}))

module.exports = router;
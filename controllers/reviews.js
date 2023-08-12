const Review = require('../models/reviews');
const Campground = require('../models/campGrounds');

module.exports.createReview = async(req,res)=>{
    const{id} = req.params;
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const campground = await Campground.findById(id);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success","Review added successfully!");
    res.redirect(`/campgrounds/show/${campground.id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const campgroundId = req.params.id;
    const {reviewId} = req.params;
    await Campground.findByIdAndUpdate(campgroundId,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully!");
    res.redirect(`/campgrounds/show/${campgroundId}`);
}
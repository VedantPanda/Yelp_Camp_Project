const {reviewSchema,campgroundSchema} = require('./validateSchemas');
const ExpressError = require("./utils/ExpressError");
const Campground = require('./models/campGrounds');
const Review = require('./models/reviews');

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be logged in!');
        return res.redirect("/login");
    }
    next();
}
    
module.exports.login = (req,res,next) => {
    if(req.isAuthenticated()){
        return res.redirect("/campgrounds");
    }
    next();
}

module.exports.storeReturnTo = (req,res,next) => {
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateReview = (req,res,next) => {
    const{error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg,404);
    }
    else{
        next();
    }
}

module.exports.validateCampground = (req,res,next) => {
    const{error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(msg,404);
    }
    else{
        next();
    }
}

module.exports.isAuthorized = async(req,res,next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash("error","Campground does not exist");
        return res.redirect(`/campgrounds`);
    }
    if(!campground.author.equals(req.user._id)){
        req.flash("error","You do not have permission to do that!");
        return res.redirect(`/campgrounds/show/${id}`);
    }
    next();
}

module.exports.isReviewAuthorized = async(req,res,next) => {
    const {id} = req.params;
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review){
        req.flash("error","Review does not exist");
        return res.redirect(`/campgrounds/show/${id}`);
    }
    if(!review.author.equals(req.user._id)){
        req.flash("error","You do not have permission to do that!");
        return res.redirect(`/campgrounds/show/${id}`);
    }
    next();
}
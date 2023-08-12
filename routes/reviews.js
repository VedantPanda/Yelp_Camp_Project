const express= require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/ExpressError");
const Campground = require('../models/campGrounds');
const Review = require('../models/reviews');
const {validateReview} = require('../middleware');
const {isLoggedIn,isReviewAuthorized} = require('../middleware');
const reviews = require('../controllers/reviews');

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthorized, catchAsync(reviews.deleteReview));

module.exports = router;
const express= require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const {validateReview} = require('../middleware');
const {isLoggedIn,isReviewAuthorized} = require('../middleware');
const reviews = require('../controllers/reviews');

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthorized, catchAsync(reviews.deleteReview));

module.exports = router;
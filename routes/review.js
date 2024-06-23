const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {reviewSchema} = require('../schema.js');
const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner,validateReview, isreviewAuthor} = require('../middleware.js');


const reviewController = require('../controllers/review.js')

//Post Route
router.post('/',isLoggedIn, validateReview, wrapAsync(reviewController.addReview))

//Delete Route
router.delete('/:reviewId', isLoggedIn,isreviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports= router;

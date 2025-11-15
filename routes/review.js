const express = require("express");
// const app = express();
const router = express.Router({ mergeParams: true });

const Listing = require("../model/listing.js");
const Review = require("../model/review.js");

//wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");

//expresserror
const ExpressError = require("../utils/ExpressError.js");

// const Joi = require('joi');
const { listingSchema } = require("../schema.js");
const { reviewSchema } = require("../schema.js");

const { validateReview, isLoggedIn,isReviewAuthor  } = require("../middleware.js");
const reviewController=require('../controllers/review.js');

//Reviews
//post review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//deleting reviews
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;

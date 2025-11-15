// route/review.js

const Listing = require("../model/listing.js");
// const review = require("../model/review.js");
const Review = require("../model/review.js");

//post review route
module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    // console.log(newReview);
    listing.review.push(newReview);
    await listing.save();
    await newReview.save();
    // res.send('saved');
    req.flash("sucess", "New Review created");
    res.redirect(`/listing/${listing._id}`);
  }

//deleting reviews
module.exports.destroyReview=async(req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess", "Review  Deleted");
    res.redirect(`/listing/${id}`);
  }
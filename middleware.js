
const Listing=require('./model/listing');
const Review=require('./model/review');
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,validateReview} = require("./schema.js");
const { reviewSchema}=require('./schema.js');


module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req );
  // console.log(req.path ,'..',req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.originalUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
};

//it is check the user is exit if exist then it will go path where i want to edit
// like if u go to new listing it will ask login,,then u will login and redirect to the new listing path

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.originalUrl) {
    res.locals.redirectUrl = req.session.originalUrl;
  }
  next();
};

module.exports.isOwner = async(req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listing/${id}`);
  }
  next();
};


// for listings
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMesg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMesg);
  } else {
    next();
  }
};


//for reviews
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMesg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(404,errMesg)
    }else{
        next();
    }
}


module.exports.isReviewAuthor = async(req, res, next) => {
  let { id,reviewId } = req.params;
  let review= await Review.findById(reviewId );
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the Author of this review");
    return res.redirect(`/listing/${id}`);
  }
  next();
};
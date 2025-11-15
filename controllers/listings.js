// route/listing.js

const Listing = require("../model/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const { listingSchema } = require("../schema.js");
const { response } = require("express");
//  index route
module.exports.index = async (req, res) => {
  let allistings = await Listing.find({});
  res.render("listing/index.ejs", { allistings });
};

//creating new
module.exports.renderNewForm = (req, res) => {
  // console.log(req.user);
  res.render("listing/new.ejs");
};

//particular route showing
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing your requested for does not exits");
    return res.redirect("/listing");
  }
  // console.log(listing);
  res.render("listing/show.ejs", { showData: listing });
};

//creating new
module.exports.creatListing = async (req, res, next) => {
  let response=await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
//   console.log(response.body.features[0].geometry);
//   res.send('done!')
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url,'\n',filename)
  let result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  }
  const newListing = new Listing(req.body.listing);
  newListing.image = { url, filename };
  // console.log(req.user);
  newListing.owner = req.user._id;
  newListing.geometry=response.body.features[0].geometry;
  let savedListing=await newListing.save();
  console.log(savedListing);
  req.flash("sucess", "New Listing Created");
  res.redirect("/listing");
  // res.render("listing/new.ejs")
};

//Edit route
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing your requested for does not exits");
    return res.redirect("/listing");
  }
  let originalImage = listing.image.url;
  if (originalImage.includes("/upload/")) {
    originalImage = originalImage.replace("/upload/", "/upload/w_250,c_fill/");
  }

  // originalImage=originalImage.replace('/upload','/upload/w_250px,h_300px,c_fill/')
  res.render("listing/edit.ejs", { listing, originalImage });
};

//Update route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("sucess", "Listing Was Updated");
  res.redirect(`/listing/${id}`);
};
// module.exports.updateListing = async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id);

//   if (!listing) {
//     req.flash("error", "Listing you requested for does not exist");
//     return res.redirect("/listing");
//   }

//   // update all text fields
//   listing.title = req.body.listing.title;
//   listing.description = req.body.listing.description;
//   listing.price = req.body.listing.price;
//   listing.location = req.body.listing.location;
//   listing.country = req.body.listing.country;

//   //  only update image if user uploaded a new one
//   if (req.file) {
//     listing.image = {
//       url: req.file.path,
//       filename: req.file.filename
//     };
//   }

//   await listing.save();
//   req.flash("sucess", "Listing Was Updated");
//   res.redirect(`/listing/${id}`);
// };

//deleting
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let c = await Listing.findByIdAndDelete(id);
  // console.log(c);
  req.flash("sucess", "Listing Was Deleted");
  res.redirect("/listing");
};

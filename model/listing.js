const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      // default: "listingimage",
    },
    url: {
      type: String,
      // default:
      //   "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.peakpx.com%2Fen%2Fhd-wallpaper-desktop-ndrvg&psig=AOvVaw2bxjDea85uvlhLSlHP-PPV&ust=1758289953009000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMCs1JG74o8DFQAAAAAdAAAAABAE",
      // set: (v) =>
      //   v === ""
      //     ? "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.peakpx.com%2Fen%2Fhd-wallpaper-desktop-ndrvg&psig=AOvVaw2bxjDea85uvlhLSlHP-PPV&ust=1758289953009000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMCs1JG74o8DFQAAAAAdAAAAABAE"
      //     : v,
    },
  },
  price: {
    type: Number,
    required: true,
    default: 5000,
  },
  location: String,
  country: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      // required:true,
    },
    coordinates:{
      type:[Number],
      // required:true
    }
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

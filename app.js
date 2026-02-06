//terminal ka mesg hide karne k liye
process.env.DOTENV_CONFIG_SILENT = "true";

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// require('dotenv').config();
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
app.listen(PORT, () => {
  console.log("listing");
});
//for views
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const Listing = require("./model/listing.js");
const Review = require("./model/review.js");

//method override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//ejs mate
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

//for styling
app.use(express.static(path.join(__dirname, "/public")));

//wrapAsync
const wrapAsync = require("./utils/wrapAsync.js");

//expresserror
const ExpressError = require("./utils/ExpressError.js");

// const Joi = require('joi');
const { listingSchema, reviewSchema } = require("./schema.js");

//cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser("secretcode"));

//for mongoose
const mongoose = require("mongoose");
const { render } = require("ejs");
const { Console } = require("console");
const review = require("./model/review.js");
const { title } = require("process");

//express-session
const session = require("express-session");
const MongoStore = require("connect-mongo");

//connect flash
const flash = require("connect-flash");

//passport
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./model/user.js");

// const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then((res) => console.log("connetion was done successfully"))
  .catch((err) => console.log(err));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
  console.log("ERROR IN MONGO SESSION STORE",err)
})

const sessionOption = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // secure: false,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/", (req, res) => {
//   res.send("working");
// });

// app.get("/registerUser", async(req, res) => {
//   let fakeUser=new User({
//     email:'fayazep@gmail.com',
//     username:'fayazep'
//   });
//   let registeruser=await User.register(fakeUser,'Fayaz23');
//   // res.send(registeruser)
//    res.json(registeruser);
// });

const listingRouter = require("./routes/listing.js");
app.use("/listing", listingRouter);

const reviewsRouter = require("./routes/review.js");
app.use("/listing/:id/reviews", reviewsRouter);

const userRouter = require("./routes/user.js");
app.use("/", userRouter);




// agr request wrong aayi toh
// app.all('(.*)',(req,res,next)=>{
//     next(new ExpressError(404,'page not found!'));
// })
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  const { status = 404, message = "inalid" } = err;
  //   res.status(status).send(message);
  // // res.send("somthing went wrong");
  res.status(status).render("error.ejs", { message });
});

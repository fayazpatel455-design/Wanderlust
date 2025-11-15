//router/user.js 
const User=require('../model/user.js')

//sending form to user for signup
module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

//signup listing
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUSer = await User.register(newUser, password);
    console.log(registerUSer);
    req.login(registerUSer, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("sucess", "Welcom To Wanderlust");
      res.redirect("/listing");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//sending form to user for login
module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};


//logining listing
module.exports.login = async (req, res) => {
  req.flash("sucess", "Welcom back to Wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect(redirectUrl);
};


//logout from listing
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("sucess", "You are logged out!");
    res.redirect("/listing");
  });
};

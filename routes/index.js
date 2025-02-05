var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function (req, res)
{
    res.render("landing");
});

// AUTH ROUTES
// show Register form
router.get("/register", function(req , res)
{
    res.render("register");
});

// handling SIGNUP logic
router.post("/register", function(req, res)
{
    var newUser = new User({username: req.body.username});
    User.register(newUser , req.body.password, function(err, user)
    {
        if (err)
        {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function()
        {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show LOGIN form
router.get("/login" , function(req, res)
{
    res.render("login");
});
// handling LOGIN logic
// app.post(login , middlware , callback)
router.post("/login" , passport.authenticate("local" , 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){});

// LOGOUT route
router.get("/logout" , function(req, res)
{
    req.logout( function(err)
    {
        if (err)
        {
            console.log(err);
            return res.redirect("logout");
        }
        req.flash("success", "You Logged Out!");
        res.redirect("/campgrounds");
    });
});

module.exports = router;
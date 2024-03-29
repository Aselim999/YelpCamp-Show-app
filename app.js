var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var localStrategy = require("passport-local");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");
var User = require("./models/user");
var seedDB = require("./seeds");
var methodOverride = require("method-override");

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/puplic"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT CONFIG
app.use(require("express-session")(
    {
        secret: "i'm the one who knows",
        resave: false,
        saveUninitialized: false
    }
));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next)
{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(3000, function ()
{
    console.log("Server is Working!");
});
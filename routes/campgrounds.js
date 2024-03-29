var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/campgrounds", function(req , res)
{
  Campground.find({})
  .then((allCampgrounds) => 
  {
    res.render("campgrounds/index", {campgrounds:allCampgrounds , currentUser: req.user});
  })
  .catch((err) => 
  {
    console.log("error has occured", err);
  })
});

router.post("/campgrounds", middleware.isLoggedIn, function(req, res)
{
//   get data from form and add it to campground array
    var name= req.body.name;
    var image= req.body.img;
    var desc= req.body.discribtion;
    var author = 
    {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground= {name: name, img: image, discribtion:desc, author: author};
    
    Campground.create(newCampground)
    .then((result) =>
    {
        res.redirect("/campgrounds");
    })
    .catch((err) =>
    {
        console.log(err);
    })
});


router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res)
{
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id" , function(req, res)
{
    // find campground with provided id
    Campground.findById(req.params.id).populate("comments")
    .then((result) =>
    {
        // render show template with that campground
        res.render("campgrounds/show" , {campground: result});
    })
    .catch((err) =>
    {
        console.log(err);
    })
});

// EDIT campground route 
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership , function(req, res)
{
    // is user logged in?
    if (req.isAuthenticated())
    {
        Campground.findById(req.params.id)
        .then((foundCampground) =>
        {
           
            res.render("campgrounds/edit" , {campground: foundCampground});
        })
    }
});

// UPDATE campground route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership , function(req,res)
{
    // find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    .then((updateCampground) =>
    {
        res.redirect("/campgrounds/" + req.params.id);
    })
    .catch((err) =>
    {
        res.redirect("/campgrounds");
    })
    // redirect somewhere (show page)
});

// DELETE route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership , function(req,res)
{
    Campground.findByIdAndDelete(req.params.id)
    .then(() =>
    {
        res.redirect("/campgrounds");
    })
    .catch(() =>
    {
        res.redirect("/campgrounds");
    })
});

module.exports = router;
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

// all the middleware goes here
var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req , res , next)
{
    if (req.isAuthenticated())
    {
        Campground.findById(req.params.id)
        .then((foundCampground) =>
        {
           // does user own the campgrround?
            if(foundCampground.author.id.equals(req.user._id))
            {
                next();
            }
            else
            {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        })
        .catch((err) =>
        {
            req.flash("error", "Campground Not Found");
            res.redirect("/campgrounds");
        })
    }
    else
    {
        req.flash("error", "You need to log in First to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req , res , next)
{
    if (req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id)
        .then((foundComment) =>
        {
           // does user own the campgrround?
            if(foundComment.author.id.equals(req.user._id))
            {
                next();
            }
            else
            {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        })
        .catch((err) =>
        {
            res.redirect("/campgrounds");
        })
    }
    else
    {
        req.flash("error", "You Need To Be Logged In First To Do That!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next)
{
    if (req.isAuthenticated())
    {
        return next();
    }
    req.flash("error", "You Need To Be Logged In First To Do That!");
    res.redirect("/login");
}


module.exports = middlewareObj; 
var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middleware = require("../middleware");

// ======================
    // COMMENTS ROUTE \\
// ======================

router.get("/campgrounds/:id/comments/new" , middleware.isLoggedIn ,function(req,res)
{
    Campground.findById(req.params.id)
    .then((result) =>
    {
        // render new comment template with that campground
        res.render("comments/new", {campground: result});
    })
    .catch((err) =>
    {
        console.log(err);
    })
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res)
{
    // lookup campground using id
    Campground.findById(req.params.id)
    .catch((err) =>
    {
        console.log(err);
        res.redirect("/campgrounds");
    })
    .then((campground) =>
    {
        Comment.create(req.body.comment)
        .then((comment) =>
        {
            // add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            // save comment
            comment.save();
            campground.comments.push(comment);
            campground.save();
            req.flash("success", "Successfully added a comment");
            res.redirect("/campgrounds/" + campground._id);
        })
        .catch((err) =>
        {
            req.flash("error", "Something went wrong");
            console.log(err);
        })
    })
    // create new comment
    // connect new comment to campground
    // redirect campground show page
});

// Edit Comment Route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res)
{
    Comment.findById(req.params.comment_id)
    .catch((err) =>
    {
        res.redirect("back");
    })
    .then((foundComment) =>
    {
        res.render("../views/comments/edit", {campground_id: req.params.id , comment: foundComment});
    })
});

// Update Comment Route
// /campgrounds/:id/comments/:comment_id
router.put("/campgrounds/:id/comments/:comment_id" , middleware.checkCommentOwnership, function(req, res)
{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
    .catch((err) =>
    {
        res.redirect("back");
    })
    .then((updatedComment) =>
    {
        res.redirect("/campgrounds/" + req.params.id);
    })
});

// COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res)
{
    Comment.findByIdAndDelete(req.params.comment_id)
    .catch(() =>
    {
        res.redirect("back");
    })
    .then(() =>
    {
        req.flash("success", "comment Deleted");
        res.redirect("/campgrounds/" + req.params.id);
    })
});

module.exports = router;
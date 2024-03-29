var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");

var data = 
[
    {
        name: "test 1",
        img: "https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?auto=compress&cs=tinysrgb&w=600",
        discribtion: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    },
    {
        name: "test 2",
        img: "https://images.pexels.com/photos/2582818/pexels-photo-2582818.jpeg?auto=compress&cs=tinysrgb&w=600",
        discribtion: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    },
    {
        name: "test 3",
        img: "https://images.pexels.com/photos/558454/pexels-photo-558454.jpeg?auto=compress&cs=tinysrgb&w=600",
        discribtion: "hello there three"
    },
]

function seedDB()
{
    // delete all 
    Campground.deleteMany({})
    .then((all) =>
    {
        console.log("deleted successfully!");
        // add new data
        data.forEach(function(seed) 
        {
            Campground.create(seed)
            .then((campground) => 
            {
                console.log("added successfully!");
                Comment.create(
                    {
                        text: "this place is good but it'd be better if there's bathroom",
                        author: "abdalla selim"
                    }
                )
                .then((comment) =>
                {
                    campground.comments.push(comment);
                    campground.save();
                    console.log("created new comment");
                })
                .catch((err) => 
                {
                    console.log(err);
                })
            })
            .catch((err) =>
            {
                console.log(err);
            })
        });
    })
    .catch((err) =>
    {
        console.log(err);
    })
    
    // add comments
}

module.exports = seedDB;
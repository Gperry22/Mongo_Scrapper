var express = require("express");
var _ = require("lodash");
var db = require("../models");
var cheerio = require("cheerio");
var axios = require("axios");
var request = require("request");
var mongoose = require('mongoose');


var router = express.Router();
module.exports = router;


// Routes
// Route for getting all Articles from the db
router.get("/", function (req, res) {
    res.render("../views/home.jade");
});

// A GET route for scraping the echojs website
router.get("/api/scrape", function (req, res) {

    // First, we grab the body of the html with request
    axios.get("http://www.echojs.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);


        db.Article.find({})
            .then(function (dbArticles) {

                // Now, we grab every h2 within an article tag, and do the following:
                $("article h2").each(function (i, element) {
                    // Save an empty result object
                    var result = {};
                    result.title = $(this)
                        .children("a")
                        .text();
                    result.link = $(this)
                        .children("a")
                        .attr("href");

                    const isFound = dbArticles.find((element) => {
                        return result.title === element.title;
                    })
                    // Add the text and href of every link, and save them as properties of the result object
                    if (!isFound) {

                        // Create a new Article using the `result` object built from scraping
                        db.Article.create(result)
                            .then(function (dbArticle) {
                                // View the added result in the console
                                // res.send(dbArticle)
                                console.log(dbArticle);
                                res.json(dbArticle);
                            })
                            .catch(function (err) {
                                // If an error occurred, send it to the client
                                res.json(err);
                            });
                    }
                    // res.json(dbArticle);

                })
                    .catch(function (err) {
                        // If an error occurred, send it to the client
                        res.json(err);
                    });

            });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
router.get("/api/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for getting all saved Articles from the db
router.get("/api/savedArticles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({ saved: true })
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

//Route for Saving a article
router.post("/save/:id", function (req, res) {
    console.log(req.params.id);

    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
        .then(function (dbArticle) {
            res.send(req.params.id + " Updated to True");
        })
        .catch(function (err) {
            res.json(err);
        });
})



// Route for saving/updating an Note and linking an Article's associated Note
router.post("/notes/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            var id = mongoose.Types.ObjectId(req.params.id);
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: id }, { $push: { notes: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

//route to delete note
router.delete("/artNoteDelete/:noteId/", function (req, res) {
    var noteId = mongoose.Types.ObjectId(req.params.noteId);
    db.Note.remove({ _id: noteId })
        .then(function () {
            res.send(req.params.noteId + " Remove");
        })
        .catch(function (err) {
            res.json(err);
        });
    })

//route to pull note Object for Articles note array
router.post("/arrayNoteDelete/:id/:noteId", function (req, res) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    var noteId = mongoose.Types.ObjectId(req.params.noteId);
    console.log('Hya', id);
    console.log('Hya', noteId);
    db.Article.update({ _id: id }, { $pull: { notes: noteId } })
        .then(function () { 
            res.send(req.params.noteId + " Pulled") 
        })                  
        .catch(function (err) {
            res.json(err);
        });
})


// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("notes")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


//Route for UNSaving a article and Removing all notes
router.post("/remove/:id", function (req, res) {
    console.log(req.params.id);
    var id = mongoose.Types.ObjectId(req.params.id);
    db.Article.findOneAndUpdate({ _id: id }, { saved: false })
        .then(function (dbArticle) {
            db.Article.update({ _id: id }, { $set: { notes: [] } })
                .then(function () {
            res.send(req.params.id + " Unsaved and Removed all Notes");
        })
        .catch(function (err) {
            res.json(err);
        });
    })


})

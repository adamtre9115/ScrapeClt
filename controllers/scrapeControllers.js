const express = require("express");
const app = express();
const request = require("request");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const articles = require("../models/articles");
const comments = require("../models/comments");


// main route
app.get("/", (req, res) => {
    res.render("index",)
})

app.get("/articles", (req, res) => {
    function getUnsaved() {
        return new Promise(function(resolve, reject) {
            // query for saved articles
            articles.find({
                isSaved: false
            }).populate("comments").exec(function(err, docs) {
                if (!err) {
                    console.log(docs[0].comments)
                    var unSaved = {
                        articles: docs
                    }
                    res.render("index", unSaved);
                    resolve();
                } else {
                    console.log(err);
                    reject();
                }
            })
        })
    }
    getUnsaved()

})
// saved articles 
app.get("/saved", (req, res) => {

    function getSaved() {
        return new Promise(function(resolve, reject) {
            // query for saved articles
            articles.find({
                isSaved: true
            }).populate("comments").exec(function(err, docs) {
                if (!err) {
                    var newSaved = {
                        articles: docs
                    }
                    res.render("saved", newSaved);
                    resolve();
                } else {
                    console.log(err);
                    reject();
                }
            })
        })
    }
    getSaved()
})



// scrape 
app.get("/scrape", (req, res) => {

    function getArticles() {
        return new Promise(function(resolve) {

            request("http://www.charlotteobserver.com/news/local/", function(err, response, html) {

                if (!err) {
                    // Load the html body from request into cheerio
                    var $ = cheerio.load(html);

                    $("article").each(function(i, element) {
                        var title = $(element).children('.teaser').children('.title').children("a").text();
                        var link = $(element).children('.teaser').children('.title').children("a").attr("href");
                        var summary = $(element).children('.teaser').children('.summary').text();

                        // If this found element had a title, link and, summary
                        // length greater than 17 because it excluedes button links that are returned
                        if (title.length > 17 && link && summary) {
                            // create a new object frome the articles
                            var scrapedData = {
                                _id: new mongoose.Types.ObjectId(),
                                title: title,
                                link: link,
                                summary: summary
                            }

                            // Insert the data in the scrapedData db
                            var scrapedArticles = new articles(scrapedData);

                            scrapedArticles.save(function(error, doc) {
                                // promise has been fulfilled if no errors
                                if (!error) {
                                    resolve()
                                } else {
                                    console.log(error)
                                }
                            });
                        }
                    })
                } else {
                    console.log(err)
                }
            })
        })
    }

    getArticles().then(() => {
        // get all articles from db
        articles.find({}, function(err, docs) {
            if (!err) {
                // place them in an object
                var newArticles = {
                    articles: docs
                }
                // send articles to front in page render
                res.render("index", newArticles)

            }

        })

    })
})

// save
app.post("/saveIt", (req, res) => {
    // create variable id
    var id = req.body.id;
    // query db for specific article
    articles.findByIdAndUpdate(id, {
        $set: {
            isSaved: true
        }
    }, function(err, articles) {
        if (!err) {
            console.log("success")
        } else {
            console.log(err)
        }
    })


    // delete
    app.post("/deleteIt", (req, res) => {
        var id = req.body.id;

        articles.findByIdAndUpdate(id, {
            $set: {
                isSaved: false
            }
        }, function(err, articles) {
            if (!err) {
                console.log("successfully removed");
            } else {
                console.log(err);
            }
        })

    })

    // comment
    app.post("/comment", (req, res) => {
        var id = req.body.id;
        var newComment = new comments({
            comment: req.body.comment,
        });

        newComment.save(function(err, doc) {
            if (err) {
                console.log(error);
            } else {
                articles.findOneAndUpdate({
                    "_id": id
                }, {
                    $push: {
                        "comments": doc._id
                    }
                }, {
                    new: true
                })
                    .exec(function(err, doc) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.redirect("/");
                        }
                    });
            }
        });

    })

})

module.exports = app;
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
                                title: title,
                                link: link,
                                summary: summary
                            }

                            // Insert the data in the scrapedData db
                            var scrapedArticles = new articles(scrapedData);

                            articles.count({
                                title: scrapedData.title
                            }, function(err, articles) {

                                if (articles === 0) {

                                    scrapedArticles.save(function(error, doc) {
                                        // promise has been fulfilled if no errors
                                        if (!error) {
                                            resolve()
                                        } else {
                                            console.log(error)
                                        }
                                    });
                                } else {
                                    console.log("These articles already exist in the database")
                                }
                            })


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
    // query db for specific article and set isSaved to true
    articles.findByIdAndUpdate(id, {
        $set: {
            isSaved: true
        }
    }, function(err, articles) {
        if (!err) {
            console.log("saved")
        } else {
            console.log(err)
        }
    })


    // delete
    app.post("/deleteIt", (req, res) => {
        var id = req.body.id;
        // search for the specific article by ID and set saved to false
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
        var name = req.body.name;
        var comment = req.body.comment;
        // form a new comment object to save to db with name and comment
        var newComment = new comments({
            name: name,
            comment: comment,
        });
        // save the comment to the db
        newComment.save(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                articles.findOneAndUpdate({
                    "_id": id
                }, {
                    $push: {
                        "name": doc._id,
                        "comments": doc._id
                    }
                }, {
                    new: true
                })
                    .exec(function(err, doc) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("commented!")
                            res.redirect("/");
                        }
                    });
            }
        });

    })

})

app.post("/deleteComm", (req, res) => {
    var id = req.body.id;
    console.log(id);
    // search for selected comment by ID then remove it
    comments.findByIdAndRemove(id, function(err, article) {
        if (err) {
            console.log("err")
        } else {
            res.sendStatus(200)
        }
    })
})

module.exports = app;
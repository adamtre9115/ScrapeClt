const express = require("express");
const app = express();
const request = require("request");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

var articles = require("../models/models.js");
// main route
app.get("/", (req, res) => {
    res.render("index")
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

module.exports = app;
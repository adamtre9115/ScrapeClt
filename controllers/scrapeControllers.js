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

    // make request to clt observer
    request("http://www.charlotteobserver.com/news/local/", function (err, response, html) {

        // Load the html body from request into cheerio
        var $ = cheerio.load(html);

        $("article").each(function (i, element) {
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

                scrapedArticles.save(function (error, doc) {
                    // Send any errors to the browser
                    if (error) {
                        console.log(error);
                    }
                    // Otherwise, send the new doc to the browser
                    else {
                        console.log("articles sent to db");
                    }
                });
            }
        })
    })
})

module.exports = app;
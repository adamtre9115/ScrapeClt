const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const path = require("path");


// this is the port we'll be listening on
var port = process.env.port || 3000;

// pull static files from the public directory
app.use(express.static("public"));
var exphbs = require("express-handlebars");

// set up bodyParser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// set up handlebars
app.engine("handlebars", exphbs({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "/views/layouts/partials")
}));

app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controllers/scrapeControllers.js");

app.use("/", routes);

app.listen(port, function() {
    console.log("I'm listening on port " + port);
});
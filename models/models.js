const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/articlesdb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connected");
});

// mongoose schema

var articleSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    link: {
        type: String,
        trim: true,
        required: true
    },
    summary: {
        type: String,
        trim: true,
        required: true
    }
});

// This creates our model from the above schema, using mongoose's model method
var articles = mongoose.model("articles", articleSchema);

module.exports = articles;
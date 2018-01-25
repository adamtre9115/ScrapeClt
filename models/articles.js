const mongoose = require("mongoose");
var Schema = mongoose.Schema;
// const db = require("../db/db.js");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected");
});

mongoose.connect('mongodb://adamtre9115:8151991Tre!@ds129023.mlab.com:29023/scraperdb');

// mongoose.connect('mongodb://localhost/articlesdb');
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
    },
    isSaved: {
        type: Boolean,
        default: false
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "comments"
    }]
});





// This creates our model from the above schema, using mongoose's model method
var articles = mongoose.model("articles", articleSchema);


module.exports = articles;
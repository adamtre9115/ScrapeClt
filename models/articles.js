const mongoose = require("mongoose");
var Schema = mongoose.Schema;
// const db = require("../db/db.js");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected");
});

mongoose.connect(process.env.MURL);

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
    timestamps: {
        type: Date,
        default: Date.now,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "comments"
    }]
});





// This creates our model from the above schema, using mongoose's model method
var articles = mongoose.model("articles", articleSchema);


module.exports = articles;
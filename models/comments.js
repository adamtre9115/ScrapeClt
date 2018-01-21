const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: "articles"
    }

});





// This creates our model from the above schema, using mongoose's model method
var comments = mongoose.model("comments", commentSchema);


module.exports = comments;
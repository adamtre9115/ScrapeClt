const mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    comment: {
        type: String
    }

});





// This creates our model from the above schema, using mongoose's model method
var comments = mongoose.model("comments", commentSchema);


module.exports = comments;
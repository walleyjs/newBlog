var mongoose = require("mongoose");
var testimonySchema = new mongoose.Schema({
    author:String,
    testimony: String,
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Testimony", testimonySchema);
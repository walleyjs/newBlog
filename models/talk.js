var mongoose = require("mongoose");
var talkSchema = new mongoose.Schema({
    topic: String,
    url: String,
    post: String,
    public_id: String,
    image_url:String,
    imagepublic_id:String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments"
    }],
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports=mongoose.model("Talks", talkSchema);

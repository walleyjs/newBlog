var Talks = require("../models/talk");
var Comments = require("../models/comment");
var Testimony = require("../models/testimony");
var express = require("express");
var router = express.Router();
router.post("/talk/:id/comment", function (req, res) {
    Talks.findById(req.params.id, function (err, talk) {
        if (err) {
            console.log(err);
        } else {
            Comments.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    talk.comments.push(comment.id);
                    talk.save();
                    res.redirect("/talk/" + req.params.id);
                }
            });
        }
    });
});
module.exports=router;
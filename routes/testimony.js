var Talks = require("../models/talk");
var Comments = require("../models/comment");
var  Testimony= require("../models/testimony");
var express = require("express");
var router = express.Router();
router.get("/testimony", function (req, res) {
    Testimony.find({}, null,{ sort: {date: -1}}, function (err,testimony) {
        if (err) {
            console.log(err);

        } else {
            console.log(testimony)
            res.render("testimony/testimony", {
                testimony:testimony
            });
        }
    });
});
router.post("/testimony",function (req, res) {
            // var filePath = req.files.image_url;
                    // console.log(result);
                    var allTests = {
                      testimony:req.body.testimony,
                      author:req.body.author
                    };
                    Testimony.create(allTests, function (err, testimony) {
                        if (err) {
                            console.log(err);
                        } else {
                            // talk.img_url.push(image.id);
                            // talk.save();
                            // console.log(testimony)
                            res.redirect("/testimony");
                        //    console.log(talk.img_url);
                        }
                    });
                }
            );
module.exports=router;
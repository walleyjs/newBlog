var Talks = require("../models/talk");
var Comments = require("../models/comment");
// var Testimony = require("../models/testimony");
var express = require("express");
var router = express.Router();
var cloudinary = require("cloudinary");
var fileParser = require('connect-multiparty')();
var cloudinaryCredentials = {
    cloud_name: 'cloudinaryCredentials.cloud_name',
    api_key: 'cloudinaryCredentials.api_key',
    api_secret: 'cloudinaryCredentials.api_secret'
};
cloudinary.config({
    cloud_name: cloudinaryCredentials.cloud_name,
    api_key: cloudinaryCredentials.api_key,
    api_secret: cloudinaryCredentials.api_secret
});
router.post("/talk", fileParser, function (req, res) {
    const filePath = req.files.url;
     const topic = req.body.topic;
     const post = req.body.post;
     var url;
     var public_id;
     var image_url;
     var imagepublic_id;
    var imgfilePath = req.files.image_url;
    //  const url;
    async function uploads() {
       
        await cloudinary.uploader.upload(imgfilePath.path, function imageupload(result) {
            if (!req.files) {
                res.status(400).send('No files were uploaded.');
            } else {
                image_url = result.url;
                imagepublic_id = result.public_id;
                console.log("======" + image_url);
                console.log(imagepublic_id);
            }
        });
    await cloudinary.uploader.upload(filePath.path, function videoupload(firstresult) {
            // console.log("--------------------- "+resul)
            if (!req.files) {
                res.status(400).send('No files were uploaded.');
            } else {
                url = firstresult.url;
                public_id = firstresult.public_id;
                console.log("first -------" + public_id);
                console.log("first -------" + url);
                
            }
        }, {
            resource_type: "video"
        });
          function created() {
            var allPosts = {
                topic: topic,
                post: post,
                image_url: image_url,
                url: url,
                public_id: public_id,
                imagepublic_id: imagepublic_id
            };
            Talks.create(allPosts, function (err, talks) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/talk");
                    console.log(talks);
                }
            });

        }
        return created();
    }
    uploads();              
   
});
router.get("/talk", function (req, res) {
    Talks.find({}, null, { sort: {date: -1}}, function (err, talks) {
        if (err) {
            console.log(err);
        } else {
            res.render("talk/index", {
                talks: talks
            });
            // console.log(cloudinary.video);
            // console.log(talks);
        }
    });
});
router.post("/talk", function (req, res) {
    Talks.create(req.body.talk, function (err, talks) {
        if (err) {
            console.log(err);
        } else {
            // console.log(talks);
            res.redirect("/talk");
        }
    });
});
router.get("/talk/new", function (req, res) {
    res.render("talk/form");
});
// router.get("/talk/:id", function (req, res) {
//     Talks.findById(req.params.id).populate("img_url").exec(function (err, talk) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.render("talk/show", {
//                 talk: talk
//             });
//             console.log(talk.img_url);
//         }
//     });
// });
router.get("/talk/:id", function (req, res) {
    Talks.findById(req.params.id).populate("comments").exec(function (err, talk) {
        if (err) {
            console.log(err);
        } else {
            res.render("talk/show", {
                talk: talk
            });
        }
    });
});
// router.get("/talk/:id", function (req, res) {
//     Talks.findById(req.params.id).populate("img_url").exec(function (err, talk) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.render("talk/show", {
//                 talk: talk
//             });
//             console.log(talk.img_url);
//         }
//     });
// });
router.delete("/talk/:id", function (req, res) {
    Talks.findByIdAndRemove(req.params.id, function (err, deleted) {
        if (err) {
            console.log(err);
        } else {
            var videoDelete = deleted.public_id;
            var imageDelete =deleted.imagepublic_id;
            // var imageDelete = deleted.img_url[0].public_id;
            cloudinary.uploader.destroy(videoDelete, function (error, result) {
                // console.log(result);
            }, {
                resource_type: "video"
            });

             cloudinary.uploader.destroy(imageDelete, function (error, result) {
                 console.log(result);
             });
            res.redirect("/talk");
            //  console.log("======================> " +deleted)
        }
    });
});
module.exports=router;

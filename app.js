var express=require("express");
// var fileUpload = require('express-fileupload');
var app=express();
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var fileParser = require('connect-multiparty')();
var bodyParser = require("body-parser");
var cloudinary = require("cloudinary");
var passport=require("passport");
var localStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var Comments = require("./models/comment");
var Testimony = require("./models/testimony");
var User = require("./models/user");
var Talks = require("./models/talk");
var talkRoute=require("./routes/talk");
var commentRoute = require("./routes/comment");
var testimonyRoute = require("./routes/testimony");
mongoose.connect("mongodb://localhost/newapi");
app.set("port",process.env.PORT || 9000);
app.set("view engine","ejs");
app.set("views","views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(methodOverride("__method"));

// app.use(fileUpload());
// models/////////////////////////////
// passport/////////
app.use(require("express-session")({
    secret: "i will be the best programmer in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(talkRoute);
app.use(testimonyRoute);
app.use(commentRoute);

// app.get("/talk",function (req,res) {
//     Talks.find({},function (err,talks) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.render("index",{talks:talks});
//             console.log(talks);
//         }
//     });
// });

// cloudinary

app.get("/", function (req, res) {
    res.redirect("/talk");
});
app.get("/landing", function (req, res) {
    res.render("landing");
});
// auth routes///////////
app.get("/register",function (req,res) {
    res.render("register");
});
// register
app.post("/register",function (req,res) {
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function (err,user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function () {
            res.redirect("/talk/new");
        });
    });
});
// login
app.get("/login",function (req,res) {
    res.render("login");
});
app.post("/login", passport.authenticate("local", {
    successRedirect:"/talk/new",
    failureRedirect:"/login"
}),function (req,res) {
    
});
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

var server=app.listen(app.get("port"),function () {
    console.log("yu are listening to port " + app.get("port"));
});
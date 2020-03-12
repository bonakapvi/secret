//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// CONNECT TO MONGODB IN PORT 27017/wikiDB //
mongoose.connect("mongodb://localhost:27017/secretDB",
{useNewUrlParser: true, useUnifiedTopology: true});

// CREATING USER SCHEMA //
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// ENCRYPTION OF PASSWORD FIELD //

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

// CREATING USER MODEL BASED ON USER SCHEMA //
const User = new mongoose.model("User", userSchema);


// HANDLE GET REQUEST TO "/" ROUTE //
app.get("/", function(req, res){
  res.render("home");
});

// HANDLE GET REQUEST TO "/login" ROUTE //
app.get("/login", function(req, res){
  res.render("login");
});

// HANDLE GET REQUEST TO "/register" ROUTE //
app.get("/register", function(req, res){
  res.render("register");
});

// HANDLE CREATING NEW USER ID //
app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets")
    }
  });
});

// HANDLE LOGING IN REQUEST //
app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          }
        }
      }
    })
  });


// LISTEN TO PORT 3000 //
app.listen(3000, function() {
  console.log("Server started on port 3000");
});

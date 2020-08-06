//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const multer = require("multer");

const homeStartingContent = "";
const aboutContent =
  "This is  a  website made using node.js, Express,MongoDB and EJS templating. It has  a compose route which is accessible after login is successful ";
const contactContent = "EMAIL : nwagbojohn@gmail.com";
const date = new Date();
const year = date.getFullYear();
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



mongoose.connect("mongodb+srv://admin-John:08168923@cluster0.68q9p.mongodb.net/blogDB", { useNewUrlParser: true });

const postSchema = {
  title: String,
  content: String,
  contentImg: Buffer,
};
const userSchema = {
  email: String,
  password: String,
};
const User = mongoose.model("User", userSchema);

const Post = mongoose.model("Post", postSchema);
app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
      year: year,
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose", {
    year: year,
  });
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save();

  res.redirect("/");
});
app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
  });
  newUser.save(function (err) {
    if (err) {
      console.log("error occurred");
    } else {
      res.render("login");
    }
  });
});
app.get("/register", (req, res) => {
  res.render("register", {
    year: year,
  });
});
app.get("/login", (req, res) => {
  res.render("login", {
    year: year,
  });
});

app.post("/login", (req, res) => {
  username = req.body.email;
  password = req.body.password;
  User.findOne({ email: username }, (err, foundUser) => {
    if (err) {
      console.log("an error occured");
    } else {
      console.log(foundUser);
      if (foundUser) {
        if (password === foundUser.password) {
          res.redirect("/compose");
        }
      }
    }
  });
});

app.get("/posts/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);

  var post;
  Post.find({}, function (err, psts) {
    console.log(psts);

    psts.forEach(function (con) {
      const storedTitle = _.lowerCase(con.title);

      if (storedTitle === requestedTitle) {
        res.render("post", {
          title: con.title,
          content: con.content,
          year: year,
        });
      }
    });
  });
  //console.log(posts);
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent,
    year: year,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent,
    year: year,
  });
});
app.get("/delete", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("delete", {
      startingContent: homeStartingContent,
      posts: posts,
      year: year,
    });
  });
});
app.post("/delete", function (req, res) {
  const checkedItemId=req.body.remove;
  console.log(checkedItemId)
  Post.findOneAndDelete(checkedItemId, function (err) {
    if (err) {
      console.log("delete unsuccessful")
    } else {
      console.log("item deleted successfully")
      res.redirect("/")
    }
  })
});
const port=process.env.PORT||3000
app.listen(port, function () {
  console.log("Server started on port 3000");
});

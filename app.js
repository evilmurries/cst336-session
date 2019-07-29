
// Set up Express
const express = require("express");
const app = express();
const session = require("express-session");
const request = require("request");
const mysql = require("mysql");
const bcrypt = require("bcrypt");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(session({
  secret : '343ji43j4n3jn4jk3n',
  resave : true,
  saveUninitialized : true
}));
app.use(express.urlencoded({extended: true}));

// Routes

app.get("/", function(req, res) {
  res.render("index");
}); // Main Route

app.post("/", function(req, res) {
  res.send("This is the root with post!");
}); // Main Route

// Local Server Listener

const port = 8081;
app.listen(port, "0.0.0.0", function() {
    console.log("Express Server is Running...");
});

/*
// Heroku Server Deployment
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Running Express Server...");
});
*/
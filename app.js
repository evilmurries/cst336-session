
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

app.post("/", async function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let hashedPwd = "$2a$10$CoYQ4Gil4k3S5P.Px/7csejON9ovh7nsCO5.3cMhgtLmwEDzDesyC";
  let passwordMatch = await checkPassword(password, hashedPwd);
  
  console.log("passwordMatch" + passwordMatch);
  
  if (username == "admin" && passwordMatch) {
    req.session.authenticated = true;
    res.render("welcome");
  } else {
    res.render("index", {"loginError": true});
  }
}); // Main Route

app.get("/myAccount", function(req, res) {
  if (req.session.authenticated) {
    res.render("account");
  } else {
    res.redirect("/");
  }
});


// Uses Bcrypt to see if a password is valid
function checkPassword(password, hashedValue) {
  return new Promise( function(resolve, reject) {
    bcrypt.compare(password, hashedValue, function(err, result) {
      console.log("Result: " + result);
      resolve(result);
    })
  })
}



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
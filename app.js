
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
  
  
  let result = await checkUsername(username);
  console.dir(result);
  let hashedPwd = "";
  
  if (result.length > 0) {
    hashedPwd = result[0].password;
  }
  
  let passwordMatch = await checkPassword(password, hashedPwd);
  
  console.log("passwordMatch" + passwordMatch);
  
  if (passwordMatch) {
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

app.get("/logout", function(req, res) {
  req.session.destroy();
  res.redirect("/");
});

function checkUsername(username) {
  let sql = "SELECT * FROM users WHERE username = ?"
  return new Promise( function(resolve, reject) {
    let conn = createDBConnection();
    conn.connect(function(err) {
      if (err) throw err;
      conn.query(sql, [username], function(err, rows, fields) {
        if (err) throw err;
        //console.log("Rows found" + rows.length);
        resolve(rows);
      }); // query
    }) // connect
  }) // promise
}


// Uses Bcrypt to see if a password is valid
function checkPassword(password, hashedValue) {
  return new Promise( function(resolve, reject) {
    bcrypt.compare(password, hashedValue, function(err, result) {
      console.log("Result: " + result);
      resolve(result);
    })
  })
}

// Middleware function for authenticating logins
function isAuthenticated(req, res, next) {
  if(!req.session.authenticated) {
    res.redirect('/');
  } else {
    next();
  }
}

function createDBConnection() {
  var conn = mysql.createConnection({
    host: "us-cdbr-iron-east-02.cleardb.net",
    user: "b966e7405b082e",
    password: "e739afd6",
    database: "heroku_d27a5db666d1cf0"
  })
  return conn;
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
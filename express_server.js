// GLOBAL REQUIREMENTS
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');

// APP SET
app.set("view engine", "ejs");

// APP USE
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));

// DATABASE 
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//APP.GET SECTION

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"]
   };

    res.render("urls_new",templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"]
   };
  res.render("urls_index", templateVars);
});

// New Route
app.get("/urls/:shortURL", (req, res) => {
  const shortURLParam = req.params.shortURL;
  // console.log(shortURLParam); // Refreshing the page
  const templateVars = {
    username: req.cookies["username"],
    shortURL: shortURLParam,
    longURL: urlDatabase[shortURLParam]
  };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
});


//APP.GET LOGIN
  app.get("/login", (req, res) => {
    let templateVars = { 
      urls: urlDatabase,
      username: req.cookies["username"]
     };
    res.render("urls_index",templateVars);

  });
function generateRandomString() {
    return (
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    );
  }


// APP.POST SECTION

app.post("/urls/:shortURL/delete", (req, res) => {
  //Add post route that removes URL resource:
  const shortURLParam = req.params.shortURL 
  delete urlDatabase[shortURLParam]
  //redirect client back to urls_index page
  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  //extract the information from the form
  // const shortURL = req.body.shortURL;
  const longURL = req.body.longURL;
  var shortUrl = generateRandomString();
    urlDatabase[shortUrl] = longURL
  console.log(req.body);
  res.redirect('/urls/' + shortUrl); 
  //Create new entry in url database
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls/" + req.params.shortURL)
});

app.post("/login", (req, res) => {
  // set cookie name to username
  let templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"]
   };
  let login = req.body.username;
  res.cookie('username', login);
  res.redirect('/urls');
})

app.post("/logout", (req, res) => {
  
  res.clearCookie('username');
  res.redirect('/urls')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

 
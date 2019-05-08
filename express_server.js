var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

var urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// New Route
app.get("/urls/:shortURL", (req, res) => {
  const shortURLParam = req.params.shortURL;
  const templateVars = {
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


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


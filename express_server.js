var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var bodyParser = require('body-parser')

app.set("view engine", "ejs"); 

app.use

// var generateshortURL

// var shortURL = generateShortURL(),
// urlDatabase[shortURL] = 
// }

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
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

// app.get("/url_show", (req,res) => {
//     let templateVars = { urls: urlDatabase };
//     res.render("urls_show", templateVars)
// })

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/hello_world", (req, res) => {
    let templateVars = { greeting: 'Hello World!' };
    res.render("hello_world", templateVars);
  });

app.post('/urls', (req, res) => {
    //extract the information from the form
    // const shortURL = req.body.shortURL;
    const longURL = req.body.longURL;
    req.body
    res.redirect('/url');
    //Create new entry in url database
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
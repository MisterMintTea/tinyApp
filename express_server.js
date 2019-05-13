// GLOBAL REQUIREMENTS
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const uuid = require("uuid/v4");
const bcrypt = require('bcrypt');
const password = "purple-monkey-dinosaur"; // found in the req.params object
const hashedPassword = bcrypt.hashSync(password, 10);

// APP SET
app.set("view engine", "ejs");

// APP USE
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// DATABASE
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    // password: "purple-monkey-dinosaur"
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "abc@example.com",
    // password: "abc"
    password: bcrypt.hashSync("abc", 10)
  }
};

// FUNCTION SECTION
const addNewUser = (email, password) => {
  const id = uuid();

  const newUser = {
    id,
    email,
    password: bcrypt.hashSync(password, 10)
  };

  users[id] = newUser; // users[id] what is users[id] here

  return id;
};

function findUser(email) {
  for (let userid in users) {
    if (email === users[userid].email) {
      return users[userid];
    }
  }
  return false;
}

function urlsForUser(id) {

  const urlDb = {};
  for(let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      urlDb[shortURL] = urlDatabase[shortURL];
    }
  }
  return urlDb;
}

function shortURLBelongsToUser (shortURL, userId) {
  return (userId === urlDatabase[shortURL].userID) 
}

//APP.GET SECTION

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  if (undefined === req.cookies["user_id"]) {
    res.redirect("/login");
    return;
  }
  let templateVars = {
    urls: urlDatabase,
    userDb: req.cookies["user_id"]
  };

  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    userDb: users[req.cookies["user_id"]],
    urls: urlsForUser(req.cookies["user_id"]),
  };
  res.render("urls_index", templateVars);
});

// New Route
app.get("/urls/:shortURL", (req, res) => {
  const shortURLParam = req.params.shortURL;
  // console.log(shortURLParam); // Refreshing the page
  const templateVars = {
    userDb: req.cookies["user_id"],
    shortURL: shortURLParam,
    longURL: urlDatabase[shortURLParam].longURL
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
  const urlData = urlDatabase[req.params.shortURL];
  if (urlData) {
    res.redirect(urlData.longURL);
  } else {
    res.redirect("/")
  }

  // no restrictions needed, && if the user is login
});

app.get("/register", (req, res) => {
  res.render("urls_register");
});

//EDIT PAGE http://localhost:8080/login
app.get("/login", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: req.cookies["user_id"]
  };
  res.render("urls_login", templateVars);
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
  const shortURLParam = req.params.shortURL;
  if(req.cookies["user_id"]) {
    delete urlDatabase[shortURLParam];
    res.redirect("/urls")

  } else {
    res.send("Error: Please be logged in")
  }
});

app.post("/urls", (req, res) => {
  //extract the information from the form
  // const shortURL = req.body.shortURL;
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: longURL, userID: req.cookies["user_id"] };
  shortURLBelongsToUser("i3BoGr", req.cookies["user_id"]);
  res.redirect("/urls/" + shortURL);
  //Create new entry in url database
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  if(req.cookies["user_id"]) {

  } else

  res.redirect("/urls/" + req.params.shortURL);
});

app.post("/login", (req, res) => {
  const user = findUser(req.body.email);
  const passwordInc = req.body.password;

  bcrypt.compare(passwordInc, user.password, function(err, passwordOk) {
    if (!user) {
      res.status(403).send("Email invalid");
    } else if (!passwordOk) {
      res.status(403).send("Password incorrect");
    } else {
      res.cookie("user_id", user.id);
      res.redirect("/urls");
    }
});
  
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Create a Registration Handler w1d4 help
app.post("/register", (req, res) => {
  var emailCheck = req.body.email;
  var passwordCheck = req.body.password;
  if (!emailCheck || !passwordCheck) {
    res.status(400).send({ error: "You Shall not Pass" });
  } else if (findUser(emailCheck)) {
    res.status(400).send("Email already exist");
  } else {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
      const registerid = addNewUser(req.body.email, hash);
    res.cookie("user_id", registerid);
    res.redirect("/urls");
    });
    
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

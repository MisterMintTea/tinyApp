// GLOBAL REQUIREMENTS //
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const uuid = require("uuid/v4");
const bcrypt = require("bcrypt");
const password = "purple-monkey-dinosaur";
const hashedPassword = bcrypt.hashSync(password, 10);

// APP SET //
app.set("view engine", "ejs");

// APP USE //
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: ["secret"]
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

// DEFAULT URL DATABASE //
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

// DEFAULT USERS DATABASE //
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "abc@example.com",
    password: bcrypt.hashSync("abc", 10)
  }
};

// FUNCTIONS SECTION //

// Creates a newUser object && places it into users database
const addNewUser = (email, password) => {
  const id = uuid();

  const newUser = {
    id,
    email,
    password
  };

  users[id] = newUser;

  return id;
};

// Returns a user's object if it exist in the users database
function findUser(email) {
  for (let userid in users) {
    if (email === users[userid].email) {
      return users[userid];
    }
  }
  return false;
}

// Loops through the urlDatabase && returns a filtered object
function urlsForUser(id) {
  const urlDb = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      urlDb[shortURL] = urlDatabase[shortURL];
    }
  }
  return urlDb;
}

// APP.GET SECTION //

// Directs user on route to Homepage
app.get("/", (req, res) => {
  res.redirect("/urls");
});

// If user is not logged in, redirects to login page. Otherwise, directs to Create TinyURL page.
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
    return;
  }
  let templateVars = {
    urls: urlDatabase,
    userDb: req.session.user_id
  };

  res.render("urls_new", templateVars);
});

// User's Homepage
app.get("/urls", (req, res) => {
  let templateVars = {
    userDb: users[req.session.user_id],
    urls: urlsForUser(req.session.user_id)
  };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// If user is logged in, displays Update page. Otherwise, throws error.
app.get("/urls/:shortURL/", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    userDb: req.session.user_id,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  if (req.session.user_id) {
    res.render("urls_show", templateVars);
  } else {
    res.send("Error: Please be logged in");
  }
});

// Directs user to longURL page
app.get("/u/:shortURL", (req, res) => {
  const urlData = urlDatabase[req.params.shortURL];
  if (urlData) {
    res.redirect(urlData.longURL);
  } else {
    res.redirect("/");
  }
});

// TinyApp Registration page
app.get("/register", (req, res) => {
  res.render("register");
});

// TinyApp Login page
app.get("/login", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: req.session.user_id
  };
  res.render("login", templateVars);
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

// APP.POST SECTION //

// Delete button on Homepage and refreshes the page if user is logged in. Otherwise, sends an error.
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURLParam = req.params.shortURL;
  if (req.session.user_id) {
    delete urlDatabase[shortURLParam];
    res.redirect("/urls");
  } else {
    res.send("Error: Please be logged in");
  }
});

// Creates a new URL
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: longURL, userID: req.session.user_id };
  res.redirect("/urls/" + shortURL);
});


// Allows user to update URL if logged in. Otherwise, throws an error.
app.post("/urls/:shortURL/", (req, res) => {
  let shortURL = req.params.shortURL;

  let templateVars = {
    urls: urlDatabase,
    userDb: req.session.user_id,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };

  if (req.session.user_id) {
    urlDatabase[shortURL].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.send("Error: Please be logged in");
  }
});

// Throws error if invalid email and password, otherwise user logs in.
app.post("/login", (req, res) => {
  const user = findUser(req.body.email);
  const passwordInc = req.body.password;

  bcrypt.compare(passwordInc, user.password, function(err, passwordOk) {
    if (!user) {
      res.status(403).send("Please enter a valid email and password!");
    } else if (!passwordOk) {
      res.status(403).send("Sorry, wrong credentials! Please try again!");
    } else {
      req.session.user_id = user.id;
      res.redirect("/urls");
    }
  });
});

// Logs the user out and clears session.
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// Throws error if email exist or invalid email and password. Otherwise, registers newUser.
app.post("/register", (req, res) => {
  const emailCheck = req.body.email;
  const passwordCheck = req.body.password;
  if (!emailCheck || !passwordCheck) {
    res.status(400).send("Please enter a valid email and password!");
  } else if (findUser(emailCheck)) {
    res.status(400).send("Email already exist");
  } else {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
      const registerid = addNewUser(req.body.email, hash);
      req.session.user_id = registerid;
      res.redirect("/urls");
    });
  }
});

// Service
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// GLOBAL REQUIREMENTS
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
const uuid = require('uuid/v4');

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

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

// FUNCTION SECTION
const addNewUser = (email, password) => {
  const id = uuid();

  const newUser = {
    id,
    email,
    password
  };

  users[id] = newUser; // users[id] what is users[id] here

  return id;
};

function findUser (email) {
  for(let userid in users) {
    if(email === users[userid].email) {
      return users[userid];
    }
  }
  return false;
}



//Loop through users.
// Find the users with the key, user_id
// Compare the password to user, req.body
// Return true password ===
// Return false;

//APP.GET SECTION

app.get("/", (req, res) => {
  res.send("Hello!");
}); 

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    user: req.cookies["user_id"]
   };

    res.render("urls_new",templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { 
    usersDb: users[req.cookies["user_id"]],
    urls: urlDatabase,
    user: req.cookies["user_id"]
   };
  res.render("urls_index", templateVars);
});

// New Route
app.get("/urls/:shortURL", (req, res) => {
  const shortURLParam = req.params.shortURL;
  // console.log(shortURLParam); // Refreshing the page
  const templateVars = {
    user: req.cookies["user_id"],
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

app.get("/register", (req, res) => {
  res.render("urls_register");
})

//EDIT PAGE http://localhost:8080/login
  app.get("/login", (req, res) => {
    let templateVars = { 
      urls: urlDatabase,
      user: req.cookies["user_id"]
     };
    res.render("urls_login",templateVars);

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
  var user = findUser(req.body.email);
  var passwordInc = req.body.password;
   if(!user) {
    res.status(403).send("Email invalid");
  } else if (passwordInc !== user.password) {
    res.status(403).send("Password incorrect");
  } else {
    res.cookie('user_id', user.id);
    res.redirect('/urls');
  }
})

app.post("/logout", (req, res) => {
  
  res.clearCookie('user_id');
  res.redirect('/urls')
})

// Create a Registration Handler w1d4 help
app.post("/register", (req, res) => {
 
  var emailCheck = req.body.email;
  var passwordCheck = req.body.password;


  
   // Sets cookie, value & pair. user_id = name, registedid = value
  // console.log(users); // Checks user object
  if(!emailCheck || !passwordCheck) {
    res.status(400).send({ error: "You Shall not Pass" });
  } else if (findUser(emailCheck)) {
    res.status(400).send("Email already exist");
  } else {
    const registerid = addNewUser(req.body.email, req.body.password);
    res.cookie('user_id', registerid);
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




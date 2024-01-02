const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("./db/conn");
const User = require("./models/register");
const staticpath = path.join(__dirname, "../public");
const template_path = path.join(staticpath, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials");

app.use(express.static(staticpath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

// Use express-session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 110 * 24 * 12, // 24 hours
    },
  })
);

// Register Handlebars partials
hbs.registerPartials(partialpath);

// Set the view engine as Handlebars
app.set("view engine", "hbs");
app.set("views", template_path);

//register page
app.get("/login", (req, res) => {
  res.render("index.hbs");
});

//register page pr data create kiya hai post method se
app.post("/register", async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    const newUser = new User({ ...req.body, password: hashedPassword });

    try {
      console.log(newUser);
      await newUser.save();
      console.log("user data inserted successfully");
      req.session.isLoggedIn = true;
      res.render("success.hbs", {
        message: "Registration successful!",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Couldn't save user data");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//register pr render kiya hai success.hbs ko
app.get("/register", (req, res) => {
  if (req.session.isLoggedIn) {
    res.render("indexg.hbs");
    req.session.isLoggedIn = false;
  } else {
    res.redirect("/");
  }
});

app.get("/", (req, res) => {
  res.render("main.hbs");
});

app.get("/signin", (req, res) => {
  res.render("signin.hbs");
});

app.get("/register/weather", (req, res) => {
  res.status(200).render("weather.hbs");
});
app.get("/register/about", (req, res) => {
  res.status(200).render("about.hbs");
});
app.get("/register/projects", (req, res) => {
  res.status(200).render("projects.hbs");
});

app.get("/register/*", (req, res) => {
  res.status(200).render("404.hbs");
});

const port = process.env.PORT || 4400;

//________________________________________________________________________________

//now abb ham log database se find karke signin page ka kam karenge

const bcrypt = require("bcrypt");

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).send("Please Register Yourself First ");
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(401).send("Incorrect password. Try Again");
    }

    res.render("indexg.hbs", {
      message: "Sign-in successful!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

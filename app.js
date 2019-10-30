const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const expressLayouts = require("express-ejs-layouts");
const keys = require("./config/keys");
const flash = require('connect-flash');
const session = require('express-session');

// Passport config
const passport = require('passport');
require('./config/passport')(passport);

const userRouter = require("./routes/user");
const indexRouter = require("./routes/index");

// Connect to Database
const mongoose = require("mongoose");
mongoose.connect(keys.MongoURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDb connected"))
  .catch(err => console.log(err));

// body-parser now supported by express and you can now get data from req.body
app.use(express.urlencoded({ extended: false}));

// flash messages are stored in the session
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

// Passport middleware to initialize instance and set up sessions
app.use(passport.initialize());
app.use(passport.session());

// Connect flash messages
app.use(flash());

// Setup ejs template
app.use(expressLayouts);
app.set("view engine", "ejs");

// Global Vars ?
// res.locals is an object passed to the rendering engine this app is using (i.e ejs)
// They will be global in the render, so no need to prepend anything on to them to use
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use("/", indexRouter);
app.use("/users", userRouter);

app.listen(port, () => {
  console.log("Server listening on port", port);
});

const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
})

// Register page
router.get('/register', (req, res) => {
  res.render('register');
})

router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  
  // Check required fields. Server side validation
  if (!name || !email || !password || !password2) {
    errors.push({msg: 'Please fill in all forms'});
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({msg: 'Passwords do not match'});
  }

  // Check password length
  if (password.length < 6) {
    errors.push({msg: 'Password should be at least 6 characters'});
  }

  // Failed Validation
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  }

  // Check for unique user in the database using email
  const user = await User.findOne({email});
  
  if (user) {
    errors.push({msg: 'Email address already in use!'});
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  }

  // Save the user in database using bcrypt
  const newUser = new User(req.body);
  await newUser.save();
  req.flash('success_msg', 'You are now registered and can log in');
  res.redirect('/users/login');
});

// Dashboard page
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    user: req.user
  });
});

module.exports = router;
/**
 * @file          index.js
 * @author        Jacob Kearns
 * @fileOverview  The pages router for this app.
 */

let express = require('express');
let router = express.Router();

/* GET Home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Home' });
});

/* GET main page. */
router.get('/', function(req, res, next) {
  res.render('main', { title: 'ChildShare' });
});

/* GET Profile page. */
router.get('/profile/:number', function(req, res, next) {
  res.render('profile', { title: 'Profile' });
});


/* GET About Us page. */
router.get('/aboutUs', function(req, res, next) {
  res.render('aboutUs', { title: 'About Us' });
});


/* GET Contribute Your Time page. */
router.get('/provideTime', function(req, res, next) {
  res.render('provideTime', { title: 'Provide Time' });
});
module.exports = router;

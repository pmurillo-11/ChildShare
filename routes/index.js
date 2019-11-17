/**
 * @file          index.js
 * @author        Jacob Kearns
 * @fileOverview  The pages router for this app.
 */

let express = require('express');
let router = express.Router();

/* GET main page. */
router.get('/', function(req, res, next) {
  res.render('main', { title: 'ChildShare' });
});

/* GET main page. */
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Profile' });
});

/* GET About Us page. */
router.get('/aboutUs', function(req, res, next) {
  res.render('aboutUs', { title: 'Profile' });
});


/* GET Contribute Your Time page. */
router.get('/provideTime', function(req, res, next) {
  res.render('provideTime', { title: 'Provide Time' });
});
module.exports = router;

/**
 * @file          app.js
 * @author        Jacob Kearns
 * @fileOverview  The main javascript file for this app, most of this is express template.
 */

let browserify = require('browserify-middleware');
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let Binary = require('mongodb').Binary;
let multer = require('multer');

// Database
let mongo = require('mongodb');
let monk = require('monk');
// Local database to be used for testing
// sudo mongod --dbpath tntdb/data
let db = monk('localhost:27017/tntdb');

// production database
//let db = monk(''...)
let indexRouter = require('./routes/index');
let parseRouter = require('./routes/parse');

let app = express();

app.enable('trust proxy');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/')));

app.use('/jquery', express.static(__dirname + '/node_modules/highlight-within-textarea/'));

// browserify everything in js directory and use default public/javascripts folder to serve up html ready files
app.use('/javascripts', browserify(__dirname + '/js'));

// Make our db accessible to our router
// Note: These need to be above the routers
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', indexRouter);
app.use('/parse', parseRouter);

// SET STORAGE
let storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage });

app.post('/uploadimage', upload.single('image'), async (req, res) => {

  let data = {};
  let collection = db.collection('scriptimages');
  // console.log(req.file)
  // save as binary
  data.file = Binary(req.file.buffer);
  data.name = req.file.originalname;
  data.mimetype = req.file.mimetype;
  data.size = req.file.size;

  collection.insert(data, function(err, result){
    res.redirect('back');
    //res.send(
    //  (err === null) ? { msg: 'uploaded to database' } : { msg: err }
    //);

  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('404: Not Found ' + req.originalUrl);
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

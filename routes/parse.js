/**
 * @file          parse.js
 * @author        Jacob Kearns
 * @fileOverview  The parse router for this app.
*/

let express = require('express');
let fs = require('fs');
let path = require('path');
let router = express.Router();

/**
 * @name      /templates
 * @desc      Function to get all the templates from the saved json file.  The
 *            templates json is specified in the function and not currently flexible.
 * @param     req is not used
 * @returns   res the json object from templates
*/
router.get('/templates', function(req, res) {

  let rawdata = fs.readFileSync(path.join(__dirname, '../resources') + '/script_template.json');
  let data = JSON.parse(rawdata);
  //console.log(data);

  res.json(data);
}); // end /templates

/**
 * @name      /localscreenshotlist
 * @desc      Function to get all the filenames from the called out directory
 * @param     req is not used
 * @returns   res an array of file names in the specified directory
*/
router.get('/localscreenshotlist', function(req, res) {

  const folder = path.join(__dirname, '../public/screenshots/');

  fs.readdir(folder, (err, files) => {
    res.json(files);
  });

}); // end /localscreenshotlist

/**
 * @name      /collectionsize
 * @desc      Function to count records in the database collection.
 * @param     :collection the database collection to be used
 * @returns   res the json object from the database
*/
router.get('/collectionsize/:collection', function(req, res) {

  let db = req.db;
  let collection = db.get(req.params.collection);

  collection.count( {}, function( e, docs ){

    //console.log(e, docs);
    if (e) {
      console.log(e);
    } else {
      res.json(docs);
    };
  });
});

/**
 * @name      /getrecord
 * @desc      Function to get a single record based on a query.
 *            An example use would be:
 *            $.ajax({
 *              type: 'GET',
 *              data: { Trace: testTrace },
 *              url: '/tests/getrecord/testlist',
 *              dataType: 'JSON'
 *            }).done(function (res) {
 *              console.log(res);
 *            });
 * @param     :collection the database collection to be used
 *            data: must be the req.query in object format
 * @returns   res the json object from the database
*/
router.get('/getrecord/:collection', function(req, res) {

    //console.log(req);

    // Set our internal DB variable
    let db = req.db;
    // Set our collection
    let collection = db.get(req.params.collection);

    collection.findOne( req.query, {}, function( e, docs ){
      res.json( docs );
    });
}); // end /getrecord

/**
 * @name      /getrecords
 * @desc      Function to get all records based on a query.
 *            An example use would be:
 *            $.ajax({
 *              type: 'GET',
 *              data: { Trace: testTrace },
 *              url: '/tests/getrecords/testlist',
 *              dataType: 'JSON'
 *            }).done(function (res) {
 *              console.log(res);
 *            });
 *            if you need to use the projection field use something like:
 *            data: { find: {Trace: testTrace}, proj: {item: 1, status: 1, _id: 0} }
 * @param     :collection the database collection to be used
 * @returns   res the json object from the database
*/
router.get('/getrecords/:collection', function(req, res) {

  // Set our internal DB variable
  let db = req.db;
  // Set our collection
  let collection = db.get(req.params.collection);

  //console.log('not specified', req.query, 'find:', req.query.find, 'proj:', req.query.proj);

  // convert to integers, sometimes converted to strings and mongo will be slower
  // this is for script stats, it needs cleaned up
  if ( req.query.find && req.query.find.year && req.query.find.year.$eq ){
    req.query.find.year.$eq = parseInt(req.query.find.year.$eq);
  };
  // this is for script stats, it needs cleaned up
  if ( req.query.find && req.query.find.month && req.query.find.month.$gte ){
    req.query.find.month.$gte = parseInt(req.query.find.month.$gte);
  };

  if (req.query.proj){

    // convert to integers, sometimes converted to strings and mongo will reject
    // todo fixme create helper that does this
    if ( req.query.proj.limit && !Number.isInteger( req.query.proj.limit )) {
      req.query.proj.limit = parseInt( req.query.proj.limit );
      //console.log(req.query.proj.limit);
    };

    if ( req.query.proj.skip && !Number.isInteger( req.query.proj.skip )) {
      req.query.proj.skip = parseInt( req.query.proj.skip );
      //console.log(req.query.proj.skip);
    };

    // todo fixme do this better
    if ( req.query.proj.sort && req.query.proj.sort.$natural && !Number.isInteger( req.query.proj.sort.$natural )) {
      req.query.proj.sort.$natural = parseInt(req.query.proj.sort.$natural);
      //console.log(req.query.proj.sort.$natural);
    };

    //console.log( req.query.find, req.query.proj )

    collection.find( req.query.find, req.query.proj, function( e, docs ){
      //console.log(e, docs.length);
      res.json( docs );
    });
  } else {

    collection.find( req.query, {}, function( e, docs ){
      res.json( docs );
    });
  };
}); // end /getrecords

/**
 * @name      /editscript
 * @desc      Function to edit an existing item in the database collection.
 *            The updates uses the Trace tag to find the object to edit currently.
 * @param     :collection the database collection to be used
 * @param     req the object to update (must include _id)
 * @returns   res the json object indicating success or failure
*/
router.put('/editscript/:collection', function(req, res) {

  // Set our internal DB variable
  let db = req.db;
  // Set our collection
  let collection = db.get(req.params.collection);

  //console.log(req.params.collection);
  //console.log(JSON.stringify(req.body));

  // Submit to the DB
  collection.update({
    _id : req.body._id
  },{ $set:
    req.body
  }, function (err, doc) {

    if (err) {
      // If it failed, return error
      res.status(500).send(err);

    } else {
      //console.log(doc);
      // status: 201 Created The request has been fulfilled, resulting in the creation of a new resource.
      res.status(201).send(doc);
    };
  });
}); // end /editscript

/**
 * @name      /addscript
 * @desc      Function to add an object to the database collection.
 * @param     :collection the database collection to be used
 * @param     req the object to add
 * @returns   res the json object indicating success or failure
*/
router.post('/addscript/:collection', function(req, res) {

  // Set our internal DB variable
  let db = req.db;
  // Set our collection
  let collection = db.get(req.params.collection);

  //console.log(req.params.collection);

  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
}); // end /addScript

/**
 * @name      /addscriptstat
 * @desc      Function to add an object to the database collection.
 *            this is customized for the script stat collection to interger and datify
 *            stuff for saving in the database
 * @param     :collection the database collection to be used
 * @param     req the object to add
 * @returns   res the json object indicating success or failure
*/
router.post('/addscriptstat/:collection', function(req, res) {

  // make sure everything is proper format before saving into db
  if(req.body.isoDate){
    req.body.isoDate = new Date(req.body.isoDate);
    req.body.isoDate = req.body.isoDate.toISOString();
  };

  if(req.body.month){
    req.body.month = parseInt(req.body.month);
  };

  if(req.body.daysDate){
    req.body.daysDate = parseInt(req.body.daysDate);
  };

  if(req.body.year){
    req.body.year = parseInt(req.body.year);
  };

  //console.log('body:', req.body);

  // Set our internal DB variable
  let db = req.db;
  // Set our collection
  let collection = db.get(req.params.collection);

  //console.log(req.params.collection);

  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
}); // end /addScript

module.exports = router;

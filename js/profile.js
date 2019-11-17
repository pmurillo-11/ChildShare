/**
 * @file        profile.js
 * @author      Jacob Kearns
 * @description A profile page for this app
 */

// import helpers
let help = require('./help.js');
let save = require('./save.js');

// scripts loading
let user = {};

// The database collections used on this page
let userCollection = 'childshare';

// DOM Ready =============================================================
$(document).ready(function() {

    // page load
    startUp();

});

/**
 * @name startUp
 * @desc handles the initial page load, loads the json objects
 * @param
 * @returns {void}
 * @function
 * @public
 * @instance
*/
function startUp(){

// determine which item we're on by using the path
let documentNumber = (window.location.pathname).split('/')[2];
// deal with special characters, etc in url
documentNumber = decodeURIComponent(documentNumber);
console.log(window.location.pathname, documentNumber);

}; // end startUp

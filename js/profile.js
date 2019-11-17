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

    let show = '';
    // determine which item we're on by using the path
    let name = (window.location.pathname).split('/')[2];
    // deal with special characters, etc in url
    name = decodeURIComponent(name);
    console.log(name);
    let fileName;

    if( name == 'Frank' ){
        fileName = 'profilefrank.png';
    } else if( name == 'Carol' ){
        fileName = 'profilecarol.png';
    } else if( name == 'Martha' ){
        fileName = 'profilemartha.png';
    } else {
        fileName = 'profilefrank.png';
    }

    show += '<img class="center" style="height: 900px; margin-top: 15px;" src="../images/' + fileName + '">';
    $('#imageHere').html( show );

}; // end startUp

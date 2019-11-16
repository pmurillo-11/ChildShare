/**
 * @file        setup.js
 * @author      Jacob Kearns
 * @description A setup file for testing.
 * see: https://stackoverflow.com/questions/38309405/how-can-i-fix-referenceerror-is-not-defined-when-using-jquery-with-mocha-js
 */

let jsdom = require('jsdom-global')();
let jQuery = require("jquery");

global.jQuery = jQuery;
global.$ = jQuery;

//https://github.com/vuejs/vue-cli/issues/2128
//window.Date = Date;
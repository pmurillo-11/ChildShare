/**
 * @file        main.js
 * @author      Jacob Kearns
 * @description Backend logic for this app (entry page)
 */

// import helpers
let help = require('./help.js');
let save = require('./save.js');

// users loading
let users = {};

// The database collections used on this page
let scriptCollection = 'childshare';

let dateSelected = $('#datepicker').val();
let startTimeSelected = $('#timepicker').val();
let endTimeSelected = $('#timepicker2').val();

let dateAvailabity = [];
let timeAvalabilitiesStart = [];
let timeAvalabilitiesEnd = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // page load
    startUp();

    console.log("whatever");

    // left button click
    $('#submitTime').on('click', newAvailability);

    $('.datepicker').datepicker({
        defaultDate: new Date(),
        setDefaultDate: true,
        autoClose: true,
    });

    $('.datepicker2').datepicker({
        defaultDate: new Date(),
        setDefaultDate: true,
        autoClose: true,
    });

    $('.timepicker').timepicker({
        autoClose: true,
    });

    $('.timepicker2').timepicker({
        autoClose: true,
    });

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
    console.log("in startUp");

    dateSelected = new Date();
        // right now we will use mocked data for the presentation
        //users = next;

        // this is the mocked data, dynamic dates so the display works reasonably during the presentation
    let today = new Date();
    let oneAfter = new Date();
    let twoAfter = new Date();
    oneAfter = new Date(oneAfter.setDate(today.getDate()+1));
    twoAfter = twoAfter.setDate(today.getDate()+2);

}; // end startUp

/**
 * @name newDate
 * @desc updates the calendar based on the seach button trigger
 * @param
 * @returns {void}
 * @function
 * @public
 * @instance
*/
function newAvailability(){

    dateSelected = $('#datepicker').val();
    startTimeSelected = $('#timepicker').val();
    endTimeSelected = $('#timepicker2').val();

    dateAvailabity.push([dateSelected]);
    timeAvalabilitiesStart.push(startTimeSelected);
    timeAvalabilitiesEnd.push(endTimeSelected);
    M.toast({html: 'Thank you for contributing!', classes: 'rounded'})
    let today = new Date();

    let show ='';

    show += '<table id = "mytable" class = "mybigtable striped" >';
   // show += '<tr ><th class = "revTableCell tableHeader center" style="padding-top: 20px; padding-bottom: 20px;">FAMILY</th>';
   // show += '<th class = "revTableCell tableHeader center">LOCATION</th>';
   // show += '<th class = "revTableCell tableHeader center">CHILDREN</th>';
    show += '<th class = "revTableCell tableHeader center">DATE</th>';
    show += '<th class = "revTableCell tableHeader center">START TIME</th>';
    show += '<th class = "revTableCell tableHeader center">END TIME</th>';

    var i;
    for (i = 0; i < timeAvalabilitiesStart.length; i++) {
        show += buildRow(dateAvailabity[i], timeAvalabilitiesStart[i], timeAvalabilitiesEnd[i]);
    }

   // rowNumber++;
    show += '</tr></table>';
    $('#scriptList').html( show );


}

function buildRow(dateSelected, startTime, endTime){

    let show = '';
    show += '<tr>'
    show += '<td class = "revTableCell">' + dateSelected + '</td>';
    show += '<td class = "revTableCell">' + startTime + '</td>';
    show += '<td class = "revTableCell">' + endTime + '</td>';
    show += '</tr>'
    return show;

}; // end buildRow


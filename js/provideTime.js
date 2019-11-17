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

// DOM Ready =============================================================
$(document).ready(function() {

    // page load
    startUp();

    console.log("whatever");

    // left button click
    $('#submitTime').on('click', newAvailability);

    $('.datepicker').datepicker({
        defaultDate: new Date(),
        setDefaultDate: true
    });

    $('.datepicker2').datepicker({
        defaultDate: new Date(),
        setDefaultDate: true
    });

    $('.timepicker').timepicker({

    });

    $('.timepicker2').timepicker({

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

    alert("Thanks for contributing!");
    let today = new Date();
    users = [{"_id":"5dd06a7560a0b03687cccfcb",
                    "userID":"aperson",
                    "userName":"aperson",
                    "firstName":"Andrew",
                    "lastName":"Mustard",
                    "image": "profile_1.png",
                    "userEmail":"aperson@gmail.com",
                    "locationCity":"Vista",
                    "secretCode":"tbd",
                    "available": [  {date: dateSelected, startTime: startTimeSelected, endTime: endTimeSelected }],
                    "rank":"1",
                    "children":[{"name":"Francis","age":"3"}]}
                ]

    let show ='';

    show += '<table id = "mytable" class = "mybigtable striped" >';
    show += '<tr ><th class = "revTableCell tableHeader center" style="padding-top: 20px; padding-bottom: 20px;">FAMILY</th>';
    show += '<th class = "revTableCell tableHeader center">LOCATION</th>';
    show += '<th class = "revTableCell tableHeader center">CHILDREN</th>';
    show += '<th class = "revTableCell tableHeader center">DATE</th>';
    show += '<th class = "revTableCell tableHeader center">START TIME</th>';
    show += '<th class = "revTableCell tableHeader center">END TIME</th>';
    show += '<th class = "revTableCell tableHeader center">CONTACT</th>';

    // filter out unavailable users
    $.each(users, function(key, value) {
        show += buildRow(value);
    });

    show += '</tr></table>';
    $('#scriptList').html( show );


}

function buildRow(value){

    let show = '';

    show += '<tr><td class = "revTableCell center"><img style="height: 200px;" src="./images/' + value.image + '"><br><div style="font-size: 22px;;">' + value.firstName + ' ' + value.lastName + '</div></td>';
    show += '<td class = "revTableCell">' + value.locationCity + '</td>';
    show += '<td class = "revTableCell">' + value.children[0].name + ', Age:' + value.children[0].age + '</td>';
    show += '<td class = "revTableCell">' + dateSelected + '</td>';
    show += '<td class = "revTableCell">' + startTimeSelected + '</td>';
    show += '<td class = "revTableCell">' + endTimeSelected + '</td>';
    show += '<td class = "revTableCell" style="max-width: 200px;">' + '<span class="chaticon"><i class="medium material-icons" style="background-color:transparent;">chat</i></span>' +  '</td>';

    return show;

}; // end buildRow


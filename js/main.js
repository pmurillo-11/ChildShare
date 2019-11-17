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

let dateSelected;
let timeSelected;

// DOM Ready =============================================================
$(document).ready(function() {

    // page load
    startUp();

    // left button click
    $('#dateSearch').on('click', newDate);

    $(".chaticon").on("click", function(event){
        showChat(event);
    });

    $('.datepicker').datepicker({
        defaultDate: new Date(),
        setDefaultDate: true,
        autoClose: true,
        minDate: new Date()
    });

    $('.timepicker').timepicker({
        autoClose: true,
    });

});

/**
 * @name showChat
 * @desc shows the chat area after click
 * @param
 * @returns {void}
 * @function
 * @public
 * @instance
*/
function showChat(elem){
    let name = elem.target.id;
    $('.chatTitle').text('Chat with ' + name);
    $('.chatArea').show();
};

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

    dateSelected = new Date();
    // right now we will use mocked data for the presentation

    // this is the mocked data, dynamic dates so the display works reasonably during the presentation
    let today = new Date();
    let oneAfter = new Date();
    let twoAfter = new Date();
    oneAfter = new Date(oneAfter.setDate(today.getDate()+1));
    twoAfter = twoAfter.setDate(today.getDate()+2);

    users = [{"_id":"5dd06a7560a0b03687cccfcb",
                "userID":"aperson",
                "userName":"aperson",
                "firstName":"Frank",
                "lastName":"Sparrow",
                "image": "profile_1.png",
                "userEmail":"aperson@gmail.com",
                "locationCity":"Vista",
                "secretCode":"tbd",
                "available": [  {date: new Date(), startTime: new Date().setHours(today.getHours() + 1), endTime: new Date().setHours(today.getHours() + 12)},
                                {date: oneAfter, startTime: new Date().setHours(oneAfter.getHours()), endTime: new Date().setHours(oneAfter.getHours() + 12)}],
                "rank":"1",
                "info": "I enjoy spending mornings with my son before I head to work",
                "children":[{"name":"Jack","age":"7"}]},
                {"_id":"5dd06a7560a0b03687cccfcb",
                "userID":"aperson",
                "userName":"aperson",
                "firstName":"Carol",
                "lastName":"Danvers",
                "image": "profile2.png",
                "userEmail":"aperson@gmail.com",
                "locationCity":"San Marcos",
                "secretCode":"tbd",
                "available": [{date: new Date(), startTime: new Date().setHours(new Date().getHours() + 1), endTime: new Date().setHours(new Date().getHours() + 3)},
                                {date: oneAfter },
                                {date: twoAfter }],
                "rank":"1",
                "info":"I'm a first time mom looking to expand my circle of support",
                "children":[{"name":"Harper","age":"1"}]},
                {"_id":"5dd06a7560a0b03687cccfcb",
                "userID":"Lily",
                "userName":"aperson",
                "firstName":"Martha",
                "lastName":"Johnson",
                "image": "profile3.png",
                "userEmail":"aperson@gmail.com",
                "locationCity":"Oceanside",
                "available": [{date: new Date(), startTime: new Date().setHours(new Date().getHours() + 4), endTime: new Date().setHours(new Date().getHours() + 12)},
                                {date: twoAfter }],
                "secretCode":"tbd",
                "info": "I'm a stay at home mom with evening availability",
                "rank":"1",
                "children":[{"name":"Lily","age":"4"}]},
            ]
    buildInterface();

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
function newDate(){

    dateSelected = $('#datepicker').val();
    timeSelected = $('#timepicker').val();
    M.toast({html: 'Search updated', classes: 'rounded'});
    buildInterface();
};

/**
 * @name buildInterface
 * @desc builds the user interface
 * @param
 * @returns {void}
 * @function
 * @public
 * @instance
*/
function buildInterface(){

    // hide chat until we have someone to chat with
    $('.chatArea').hide();

    let show ='';

    show += '<table id = "mytable" class="mybigtable striped" >';
    show += '<tr ><th class = "revTableCell tableHeader center" style="padding-top: 20px; padding-bottom: 20px;">FAMILY</th>';
    show += '<th class = "revTableCell tableHeader center">LOCATION</th>';
    show += '<th class = "revTableCell tableHeader center">CHILDREN</th>';
    show += '<th class = "revTableCell tableHeader center">INFO</th>';
    show += '<th class = "revTableCell tableHeader center">CONTACT</th>';

    // filter out unavailable users
    $.each(users, function(key, value) {

        let d = new Date(dateSelected);
        let t;
        if ( timeSelected ){
            t = Date.parse(dateSelected + ' ' + timeSelected);
        }
        console.log(value.available, d, t)
        // filter table based on search if there is a search entered
        if( value.available ){

            for(let i = 0; i < value.available.length; i++){
                //console.log(value.available[i].date, timeSelected)
                if( new Date(value.available[i].date).getDate() == d.getDate() &&
                    new Date(value.available[i].date).getMonth() == d.getMonth() &&
                    new Date(value.available[i].date).getFullYear() == d.getFullYear()){

                    // if no time is selected show all for that date, else sort out by time
                    if ( timeSelected && t &&
                        value.available[i].startTime <= t &&
                        value.available[i].endTime >= t ){

                        show += buildRow(value);

                    } else if (!t || !value.available[i].startTime) {
                        show += buildRow(value);
                    };
                };
            };
        };
    });

    show += '</tr></table>';
    $('#scriptList').html( show );

    $(".chaticon").on("click", function(event){
        showChat(event);
    });

}; // end buildInterface

/**
 * @name buildRow
 * @desc builds the table row
 * @param value
 * @returns show - a string of the html for that table row
 * @function
 * @public
 * @instance
*/
function buildRow(value){

    let show = '';

    show += '<tr><td class = "revTableCell center"><a href="/profile/' + value.firstName + '"><img style="height: 200px; margin-top: 15px;" src="./images/' + value.image + '"></a><br><div style="font-size: 22px;;">' + value.firstName + ' ' + value.lastName + '</div></td>';
    show += '<td class = "revTableCell">' + value.locationCity + '</td>';
    show += '<td class = "revTableCell">' + value.children[0].name + ', Age:' + value.children[0].age + '</td>';
    show += '<td class = "revTableCell">' + value.info + '</td>';
    show += '<td class = "revTableCell" style="max-width: 200px;"><span class="chaticon"><i class="medium material-icons" id="' + value.firstName + '" style="background-color:transparent;">chat</i></span>' +  '</td>';

    return show;

}; // end buildRow

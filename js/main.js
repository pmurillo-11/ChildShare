/**
 * @file        main.js
 * @author      Jacob Kearns
 * @description Backend logic for this app (entry page)
 */

// import helpers
let help = require('./help.js');
let save = require('./save.js');

// scripts loading
let scripts = {};

// The database collections used on this page
let scriptCollection = 'childshare';

// the strings that we are searching for, defaults to AND search, if * is an item it is an OR search
let searches = [];

let dateSelected;

// DOM Ready =============================================================
$(document).ready(function() {

    // page load
    startUp();

    // left button click
    $('#dateLeft').on('click', newDate);
    $('#dateRight').on('click', newDate);

    // search bar inputs, search bar uses chips, see:
    // https://materializecss.com/chips.html
    $('.chips-initial').chips({
        placeholder: 'Search',
        secondaryPlaceholder: '+Search',

        onChipAdd: function(e, dataChip) {
            searchIt(e[0].textContent);
        },
        onChipDelete: function(e, dataChip) {
            searchIt(e[0].textContent);
        }
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

    dateSelected = new Date();
    showDateSelector();

    help.getEntireCollection(scriptCollection, {}, function(next){;
        //console.log(next);
        // use fake data instead of database
        //scripts = next;
        scripts = [{"_id":"5dd06a7560a0b03687cccfcb",
                    "userID":"aperson",
                    "userName":"aperson",
                    "firstName":"A",
                    "lastName":"Person",
                    "image": "family_1.png",
                    "userEmail":"aperson@gmail.com",
                    "locationCity":"San Diego",
                    "secretCode":"tbd",
                    "rank":"1",
                    "children":[{"name":"Mustard","age":"4"}]}]
        console.log(scripts)
        buildInterface();
    });

}; // end startUp

function showDateSelector(){

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let show = monthNames[dateSelected.getMonth()] + ' ' + dateSelected.getDate() + ' ' + dateSelected.getFullYear();
    $('#dateShown').html( show );
};

/**
 * @name newScript
 * @desc creates a new script when the button is pressed
 * @param
 * @returns {void}
 * @function
 * @public
 * @instance
*/
function newScript(){

    //https://stackoverflow.com/questions/19053181/how-to-remove-focus-around-buttons-on-click
    $(this).trigger("blur");
    // clear so table gets re-drawn
    $('#scriptList').html('');

    // refresh from the db so we don't get duplicates if people are creating scripts off of an
    // old version of the page
    help.getEntireCollection(scriptCollection, {}, function(next){;
        console.log(next);
        let scriptIDs = next;

        // find the largest id number, the new script will be one higher
        let max = 0;
        for (let i = 0; i < scriptIDs.length; i++) {
            if ( parseInt(scriptIDs[i].id) > max ) {
                max = parseInt(scriptIDs[i].id);
            };
        }; // end for

        max++;
        // not excited about this template but it works
        let toWrite = {userID: 'aperson', userName: 'aperson', firstName: 'A', lastName: 'Person', userEmail: "aperson@gmail.com",
            locationCity: "San Diego", secretCode: "tbd", rank: 1,
            children: [{ "name": "Mustard", "age": 4 }],
        };

        save.newScript( 'parse/addscript/' + scriptCollection, toWrite, function (next){

            startUp();
        }); // end save.newScript
    });
}; // end newScript

function newDate(event){

    console.log(event.currentTarget.id)

    if (event.currentTarget.id.includes('Left')){
        dateSelected.setDate(dateSelected.getDate()-1);
    }

    showDateSelector();
}

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

    let show ='';

    //show += '<button id="newScriptButton" class="leftButton topAndBottom" type="button">NEW SCRIPT</button>';
    show += '<table id = "mytable" class = "sortable">';
    show += '<tr><th class = "revTableCell">Name</th>';
    show += '<th class = "revTableCell">Location</th>';
    show += '<th class = "revTableCell">Children</th>';
    show += '<th class = "revTableCell">Info</th>';
    show += '<th class = "revTableCell">Contact</th>';
    $('#newScriptButton').removeClass('invisible');

    $.each(scripts, function(key, value) {

        // filter table based on search if there is a search entered
        if ( searches.length > 0 ) {

            let rowContent = value.id + ' ' + ' ' + value.category + ' ' + value.productcategory + ' ' + value.title;
            rowContent = rowContent.toLowerCase();

            for ( let i = 0; i < searches.length; i++ ) {

                // they would like to default to AND search unless there is a *
                if ( searches.indexOf('*') == -1 && searches[i] != '' && rowContent.includes(searches[i].toLowerCase().trim())) {
                    console.log(searches[i], 'found');

                    // build row if this is the last search
                    if ( i == searches.length - 1 ) {
                        show += buildRow(value);
                    };
                // exit if no search term found since this is a default AND search
                } else if ( searches.indexOf('*') == -1 ) {
                    break;
                // the OR search case is left
                } else if (searches[i] != '' && rowContent.includes(searches[i].toLowerCase().trim())) {
                    show += buildRow(value);
                    // break here so we don't get duplicates
                    break;
                };
            };

        // if no search criteria show everything
        } else {
            show += buildRow(value);
        };


    });

    show += '</tr></table>';
    $('#scriptList').html( show );

    // Make columns sortable alphabetically
    let newTableObject = document.getElementById('mytable');
    sorttable.makeSortable(newTableObject);

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

    show += '<tr><td class = "revTableCell"><img src="./images/' + value.image + '"> \n' + value.firstName + ' ' + value.lastName + '</td>';
    show += '<td class = "revTableCell">' + value.locationCity + '</td>';
    show += '<td class = "revTableCell">' + value.children[0].name + ', Age:' + value.children[0].age + '</td>';
    show += '<td class = "revTableCell">' + '</td>';
    show += '<td class = "revTableCell">' + '</td>';

    return show;

}; // end buildRow

/**
 * @name searchIt
 * @desc function for adding or removing words from the search bar, rebuilds table once searches executed
 * @param searchValues
 * @returns {void}
 * @function
 * @public
 * @instance
*/
function searchIt(searchValues){

    // the interface puts close after every chip to represent the X
    searches = searchValues.split('close');
    // the last element is alwasy "" so remove it
    searches.pop();
    //console.log(searches);

    // change the chip color
    $('.chip').addClass('light blue lighten-3');

    buildInterface();
}; // end searchIt

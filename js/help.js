/**
 * @file          help.js
 * @author        Jacob Kearns
 * @fileOverview  The helpers javascript file for this app.
*/

/**
 * @name      getStrings
 * @desc      Function to get the templates object from resources, an example:
 *            help.getStrings(function(next) {console.log(next); });
 * @param     next - allows you to wait for response before continuing the rest of the program (a callback)
 * @returns   response - the json object, should be same as objectTemplates.json
*/
let getStrings = function ( next ) {
    //jQuery AJAX call for JSON
    //$.getJSON( window.location.href + 'parse/strings', function( res ) {
    $.getJSON( '../parse/strings', function ( res ) {
        //console.log(res);
        next( res );
    } );
}; // end getStrings

/**
 * @name      getTemplates
 * @desc      Function to get the templates object from resources, an example:
 *            help.getTemplates(function(next) {console.log(next); });
 * @param     next - allows you to wait for response before continuing the rest of the program (a callback)
 * @returns   response - the json object, should be same as objectTemplates.json
*/
let getTemplates = function ( next ) {

    //jQuery AJAX call for JSON
    $.getJSON( '../parse/templates', function ( res ) {
        //console.log(res);
        next( res );
    } );
}; // end getTemplates

/**
 * @name      noUndef
 * @desc      Check for undefined, retrun blank if found, used when you don't
 *            want to display undefined, which are generally caused by importing or adding
 *            variables when the item is already created, an example use is:
 *            tableContent += '<td align="left">' + help.noUndef(this.Functional_Group) + ' </td>';
 * @returns   either a blank string or the string
*/
let noUndef = function ( str ) {

    if ( str == 'undefined' || str == undefined ) {
        return ( '' );
    } else {
        return ( str );
    };
}; // end noUndef

/**
 * @name      objTable
 * @desc      Function to get the templates object from resources and build the table based on the object
 *            sent to the helper
 * @param     item - the key of the item to be listed (e.g. project)
 * @param     templates - the template object
 * @param     toShow - the object to show in the table
 * @param     noShow - an array of template values or keys you do not want to show in the table
 * @param     next - allows you to wait for response before continuing the rest of the program (a callback)
 * @returns   show - the html string to show the table
*/
let objTable = function ( item, templates, toShow, noShow, next ) {
    // the string variable to capture the html
    let show = '';
    // push more defaults not to show
    noShow.push( 'text_id', 'collection' )
    //console.log('toshow', toShow, 'noShow', noShow);

    //jQuery AJAX call for JSON
    $.each( templates[item], function ( key, value ) {

        // don't show items already displayed or items not meant to be displayed as defined by the noShow Array
        if ( noShow.indexOf( value ) === -1 && noShow.indexOf( value.input_type ) === -1 && noShow.indexOf( key ) === -1 ) {
            //console.log(key, value);
            // don't show undefined values
            if ( toShow[key] == undefined || toShow[key] == 'undefined' ) {
                toShow[key] = '';
            };
            // if value is an object additional information is available for use
            if ( typeof ( value ) == 'object' ) {

                // linkify Document Number
                if ( value.output_type && value.output_type.includes( '-link' ) ) {
                    // determine what to link to
                    let toLink = value.output_type.substr( 0, value.output_type.indexOf( '-' ) );
                    show += '<tr><td align="right">' + value.item_description + ': </td>';
                    show += '<td><a href="../' + toLink + '/' + toShow[key] + ' "class="linkshowdocument" id="' + toShow[key] + '" target="">' + toShow[key] + '</a></td></tr>';

                } else if ( value.input_type && value.input_type.includes( 'object-' ) ) {

                    let objName = value.input_type.substr( value.input_type.indexOf( '-' ) + 1, value.input_type.length );
                    //console.log (toShow[key], objName, value);
                    insideObjTable( objName, templates, toShow[key], [], function ( next ) {
                        //console.log (next);
                        show += next;
                    } ); // end help.objTable

                } else if ( value.input_type && value.input_type.includes( 'image' ) ) {

                    show += showImage( value.item_description, toShow[key] );

                } else {
                    show += '<tr><td align="right">' + value.item_description + ': </td><td>' + toShow[key] + '</td></tr>';
                }
            } else {
                show += '<tr><td align="right">' + key + ': </td><td>' + toShow[key] + '</td></tr>';
            };
        };
        //console.log(key, value);
    } );
    show += '</tbody></table>'
    next( show );
}; // end objTable

/**
 * @name      insideObjTable
 * @desc      Function to help objTable helper display nested objects it is moved here to simplify
 * @param     item - the key of the item to be listed (e.g. project)
 * @param     templates - the template object
 * @param     toShow - the object to show in the table
 * @param     noShow - an array of template values or keys you do not want to show in the table
 * @param     next - allows you to wait for response before continuing the rest of the program (a callback)
 * @returns   show - the html string to show the table
*/
let insideObjTable = function ( item, templates, toShow, noShow, next ) {
    let show = '';
    let thisKey;

    // sort out which template item to reference
    if ( templates[item] && Object.keys( templates[item] ).length == 1 ) {
        thisKey = templates[item][Object.keys( templates[item] )[0]];
    } else if ( templates[item] && Object.keys( templates[item] ).length > 1 ) {
        thisKey = templates[item];
    };

    // This maybe should iterate throught the template instead, doesn't matter if we're just showing
    // does matter for editing
    $.each( toShow, function ( key, value ) {

        // console.log( thisKey, key, value );

        if ( thisKey && thisKey.input_type && thisKey.input_type.includes( ( 'object-' ) ) ) {

            show += '<div class="row"><div class="col s4" align="right">' + thisKey.item_description + ': </div><div class="col s8">' + key + '</div></div>';
            let objName = thisKey.input_type.substr( thisKey.input_type.indexOf( '-' ) + 1, thisKey.input_type.length );
            insideObjTable( objName, templates, toShow[key], [], function ( next_ ) {
                //console.log (next_);
                show += next_;
            } ); // end help.objTable
        }

        else if ( thisKey && thisKey.input_type && thisKey.input_type.includes( ( 'image' ) ) ) {
            show += showImage( thisKey[key].item_description, toShow[key] );
            console.log( "show", show );
        }

    } ); // end $.each

    next( show );
}; // end insideObjTable

/**
 * @name      buildObjectRow
 * @desc      Function to help objTable helper display nested objects it is moved here to simplify
 * @param     item - the key of the item to be listed (e.g. project)
 * @param     templates - the template object
 * @param     toShow - the object to show in the table
 * @param     noShow - an array of template values or keys you do not want to show in the table
 * @param     next - allows you to wait for response before continuing the rest of the program (a callback)
 * @returns   show - the html string to show the table
*/
let buildObjectRow = function ( item, templates, toShow, oneUp, next ) {

    //console.log( toShow );
    let show = '';
    let thisKey;

    // sort out which template item to reference
    if ( templates[item] && Object.keys( templates[item] ).length == 1 ) {
        thisKey = templates[item][Object.keys( templates[item] )[0]];
    } else if ( templates[item] && Object.keys( templates[item] ).length > 1 ) {
        thisKey = templates[item];
    };

    let bgColorNow = '';

    // handle object in object
    if ( toShow && thisKey && thisKey.input_type && thisKey.input_type.includes( ( 'object-' ) ) ) {

        $.each( toShow, function ( key, value ) {

            // make the first column of every other step group gray
            if ( ( parseInt( key / 10 ) ) % 2 == 1 ) {
                bgColorNow = 'bgGray';
            } else {
                bgColorNow = '';
            };

            let buttonID = oneUp + '.' + key;

            // note this is repeated in the update file, add new row
            show += '<div class="row"><div align="right" class= "col s4' + bgColorNow + '">';

            // Only add button above for main steps
            if ( key % 10 == 0 ) {
                show += '<button type="button" name="' + buttonID + '" class= "addRowAboveButton btn"> Add Steps Above </button><br>';
            };

            show += '<button type="button" id="' + buttonID + '" class= "deleteSectionButton btn-small red darken-4"> Delete Section <i class="material-icons right">delete</i></button>';
            show += thisKey.item_description + ': </div>';
            show += '<div class="col s8">' + key + '</div></div>';

            let twoUp = oneUp + '.' + key;
            let objName = thisKey.input_type.substr( thisKey.input_type.indexOf( '-' ) + 1, thisKey.input_type.length );

            buildObjectRow( objName, templates, toShow[key], twoUp, function ( next_ ) {
                //console.log (next_);
                show += next_;
            } ); // end buildObjectRow
        } ); // end $.each

    } else if ( toShow && thisKey && thisKey.input_type && thisKey.input_type.includes( ( 'array-' ) ) ) {

        //thisKey = templates['step'];
        let templateKey = thisKey.input_type.split( '-' )[1];
        thisKey = templates[templateKey];
        //console.log (toShow, thisKey);

        for ( let i = 0; i < toShow.length; i++ ) {

            $.each( toShow[i], function ( key, value ) {

                //console.log ( thisKey, toShow[i], key, value );
                //TODO: Update to go from template instead of existing item...
                //make the first column of every other step group gray
                if ( ( parseInt( toShow[i].number / 10 ) ) % 2 == 1 ) {
                    bgColorNow = 'blue lighten-5';
                } else if ( toShow[i].revision ) {
                    bgColorNow = 'red lighten-5'
                } else {
                    bgColorNow = '';
                };

                // set the delete button ID so we know what to delete
                let buttonID = oneUp + '.';
                if ( toShow[i].number ) {
                    buttonID += toShow[i].number;
                } else if ( toShow[i].revision ) {
                    buttonID += toShow[i].revision;
                };

                let entryField = oneUp + '.' + i + '.' + key;

                // note this is repeated in the update file, add new row
                show += '<div class="row valign-wrapper ' + bgColorNow + '" style="margin-bottom: -5px"><div class= "col s4 right-align">';

                // if the number row, add add steps and delete buttons, and make it non interactable
                if ( key == 'number' || key == 'revision' ) {
                    // Only add button above for main steps
                    if ( parseInt( toShow[i].number ) % 10 == 0 ) {
                        show += '<button type="button" name="' + buttonID + '" style= "margin-bottom: 10px" class= "addRowAboveButton btn"> Add Steps Above </button><br>';
                    };

                    show += '<button type="button" id="' + buttonID + '" class= "deleteSectionButton btn-small red darken-4"> Delete Section <i class="material-icons right">delete</i></button></div>';
                    show += '<div class="input-field col s4 right-align">' + thisKey[key].item_description + ': </div>';
                    show += '<div class="input-field col s4"><textarea class="materialize-textarea" style="margin-bottom: 0px" id="' + entryField + '" placeholder = "' + thisKey[key].descriptive_text + '">' + noUndef( toShow[i][key] ) + '</textarea>';
                    show += '</div></div>';
                } else {
                    //console.log(thisKey[key].item_description);
                    show += thisKey[key].item_description + ': </div>';
                    show += '<div class="input-field col s8"><textarea class="materialize-textarea" style="margin-bottom: 0px" id="' + entryField + '" placeholder = "' + thisKey[key].descriptive_text + '">' + noUndef( toShow[i][key] ) + '</textarea></div>';

                    // TODO: FIX TO DISPLAY IMAGES, right now callback issues with this whole function
                    // if ( key.includes('image')) {
                    //     //show += '<td>' + toShow[i][key] + '</td>';

                    //     findAndShowImage( toShow[i][key], function(res) {

                    //         if ( res != '' ) {
                    //             show += '<td>';
                    //             show += '<img ';
                    //             show += res + ' width="240" hieght="160">';
                    //             show += '</td></tr>';
                    //             //console.log(show)
                    //         };
                    //     });
                    // };

                    show += '</div>';
                    //console.log ( key, value.input_type )

                };
            } );
        };

    } else if ( toShow ) {

        $.each( thisKey, function ( key, value ) {
            let entryField = oneUp + '.' + key;

            // make the first column of every other step group gray
            if ( oneUp.includes( 'steps.' ) && ( parseInt( oneUp.split( '.' )[1] / 10 ) ) % 2 == 1 ) {
                bgColorNow = 'bgGray';
            } else {
                bgColorNow = '';
            };

            show += '<div class="row valign-wrapper "><div align="right" class = "col s4 ' + bgColorNow + '">' + value.item_description + ': </div>';
            show += '<div class="col s8"><textarea class="materialize-textarea" style="margin-bottom: 0px" id="' + entryField + '" placeholder = "' + value.descriptive_text + '">' + noUndef( toShow[key] ) + '</textarea>';
            show += '</div></div>';
        } );
    };

    next( show );
}; // end buildObjectRow

/**
 * @name      showImage
 * @desc      Function to help objTable helper display images
 * @param     description - the description of the item
 * @param     file - the image to show
 * @returns   show - the html string to show the table
*/
let showImage = function ( description, file ) {
    // console.log( 'HERE?!?' )
    let show = '';
    show += '<tr><td align="right">' + description + ': </td><td>' + file
    show += '<img src= "../screenshots/'+ file + '" width="250" height="160"></td></tr>';
    // console.log( "showImage", show );
    return show;

}; // end showImage

/**
 * @name     buildInputTableRow
 * @desc     Function to build an input table one row at a time (each call is a row)
 * @param    key - the key of the item to be listed (e.g. project)
 * @param    value - the value of the item to be listed (e.g. 'text_id')
 * @param    fillObj - the object used to fill values previously saved (edit field only)
 * @param    templates - the template object
 *           note: the template must include .collection with the collection associated with that template
 * @param    next - allows you to wait for response before continuing the rest of the program (a callback)
 * @returns  show an html string of a new table row
*/
let buildInputTableRow = function ( key, value, fillObj, templates, next ) {
    //console.log('fillObj', fillObj);
    //console.log(key, value)
    let show = '';

    // don't display undefined, can sneak in through data imports
    let fill = noUndef( fillObj[key] );

    // console.log(value, typeof(value));
    // don't display the collection field or sections field
    if ( key == 'collection' ) {
        next( show );
    } else if ( value.input_type && value.input_type.includes( 'object-' ) ) {
        let objName = value.input_type.substr( value.input_type.indexOf( '-' ) + 1, value.input_type.length );
        //console.log ('fillObj[key]', fillObj[key], objName, value);
        buildObjectRow( objName, templates, fillObj[key], key, function ( next_ ) {
            show += next_
        } );

        next( show );
    } else if ( value.input_type && value.input_type.includes( 'array-' ) ) {

        alert( 'missing function, check code!!' )

    } else if ( value.input_type && value.input_type.includes( 'text_id' ) ) {

        // use the input name attribute to pass the array position to the save function for edits only
        show += '<div class = "row valign-wrapper"><div class = "col s4">' + value.item_description + ': </div>';
        show += '<div class = "col s8">' + fill + '</div></div>';
        next( show );
    } else if ( value.input_type && value.input_type.includes( 'dropdown-' ) ) {

        let temp;
        // split the value to get the dropdown template to use, first figure out if it came
        // from an object and assign correct variable
        if ( value.input_type ) {
            temp = value.input_type.split( '-' );
        } else {
            temp = value.split( '-' );
        }

        // if the dropdown includes a . it references a json object to get from the db
        if ( temp[1].includes( '.' ) ) {

            queryAll( temp[1], templates, function ( next_ ) {
                // sort alphabetically
                next_.sort();

                show += '<div class= "row valign-wrapper"><div class= "col s4" align="right">' + value.item_description + ': </div><div class="col s8"><select' + ' id="e' + key + '" name="' + key + '"value="' + fill + '">';

                // add a blank field or prefilled field with current value to the top of the drop down
                show += '<option value="' + '' + '">' + '' + '</option>';

                // add the rest of the drop down list
                for ( let i = 0; i < next_.length; i++ ) {

                    show += '<option value="' + next_[i] + '" ';

                    //console.log(fill, next_[i])
                    // Make the previously selected test type the default value on the dropdown
                    if ( next_[i] == fill ) {
                        show += 'selected';
                    };

                    show += '>' + next_[i] + '</option>';
                };

                show += '</div></div>';
                next( show );

            } ); // end
        } else {

            show += '<div class="row valign-wrapper"><div class="col s4" align="right">' + value.item_description + ': </div>';
            show += '<div class="col s8"><select id="e' + key + '" name="' + key + '" value="' + fill + '">';
            // use the dropdown
            $.each( templates.dropdowns[temp[1]], function ( key, value ) {

                show += '<option value="' + value + '" ';

                // Make the previously selected test type the default value on the dropdown
                if ( value == fill ) {
                    show += 'selected';
                };
                show += '>' + value + '</option>';
            } );
            //next(show);
            show += '</div></div>';
            next( show );
        } // end else

    } else {

        if ( typeof ( value ) == 'object' ) {

            // the date input type is populated here (and maybe others)
            if ( value.input_type.includes( 'date' ) ) {

                show += '<div class="row valign-wrapper"><div class="col s4" align="right">' + value.item_description + ': </div>';
                show += '<div class="col s8"><input type=' + value.input_type + ' id="' + key + '" name="' + key + '" value="' + fill + '"></div></div>';
                next( show );
            } else if ( value.input_type.includes( 'image' ) && key != '' ) {
                show += '<div class="row valign-wrapper"><div class="col s4" align="right">' + value.item_description + ': </div><div class="col s4"><textarea class="materialize-textarea" style="margin-bottom: 0px" id="' + key + '" name="' + key + '" placeholder = "' + value.descriptive_text + '">' + fill + '</textarea></div>';

                findAndShowImage( fillObj[key], function ( res ) {
                    if ( res != '' ) {
                        show += '<div class="col s4">';
                        show += '<img ';
                        show += res + ' width="250" hieght="160">';
                        show += '</div>';
                    };

                    show += '</div>';

                    next( show );
                } );

            } else {
                show += '<div class="row valign-wrapper"><div class="col s4" align="right">' + value.item_description + ': </div>';
                show += '<div class="col s8"><textarea class="materialize-textarea" style="margin-bottom: 0px" id="' + key + '" name="' + key + '" placeholder = "' + value.descriptive_text + '">' + fill + '</textarea></div></div>';
                next( show );
            };

        } else {
            show += '<div class="row valign-wrapper"><div class="col s4" align="right">' + key + ': </div>';
            show += '<div class="col s8"><input type=' + value.input_type + ' id="' + key + '" name="' + key + '" value="' + fill + '"></div></div>';
            next( show );

        };

    }; // end else
}; // end buildInputTableRow

/**
 * @name     findAndShowImage
 * @desc     Function to find and show an image based on the file name, this app started with directory storage,
 *           then migrated to database storage, this handles either case.
 * @param    imageFile - the image file name
 * @param    next - allows you to wait for response before continuing the rest of the program (a callback)
 * @returns  show an html string of an image source, you need to provide the rest of the html elsewhere
*/
let findAndShowImage = function ( imageFile, next ) {

    // console.log (imageFile);
    let show = '';

    if ( imageFile ) {

        // first check local file storage
        $.getJSON( '../parse/localscreenshotlist/', function ( res ) {
            //console.log(res);

            if ( res.includes( imageFile ) ) {

                show += 'src= "../screenshots/' + imageFile + '" ';
                next( show );

                // second check database storage
            } else {

                $.ajax( {
                    type: 'GET',
                    data: { name: imageFile },
                    url: '../parse/getrecord/scriptimages',
                    dataType: 'JSON'
                } ).done( function ( res, err ) {
                    //console.log(res, err);
                    if ( res && res.file ) {

                        show += 'src="data:image/png;base64,' + res.file + '" ';
                        next( show );
                    } else {
                        next( show );
                    }
                } );
            }; // end else
        } ); // end $.getJSON

    } else {
        next( show );
    };

}; // end findAndShowImage

/**
 * @name     addNewStep
 * @desc     Function to add a new script step, adds 3 steps, one for the description, one for yes, one for no
 * @param    oneUp - the oneUp object key
 * @param    fillObj - the object used to fill values previously saved (edit field only)
 * @param    template - the template object
 *           note: the template must include .collection with the collection associated with that template
 * @param    next - allows you to wait for response before continuing the rest of the program (a callback)
 * @returns  show an html string of a new table row
*/
let addNewStep = function ( fillObj, template, oneUp, next ) {

    let show = '';

    $.each( template, function ( key, value ) {
        let entryField = oneUp + '.' + key;
        show += '<div class="row valign-wrapper" style="margin-bottom: 0px">';
        show += '<div class= "col s4 right-align"> ' + value.item_description + ': </div>';
        show += '<div class= "col s8"><textarea class="materialize-textarea" style="margin-bottom: 0px" id="' + entryField + '" name="' + key + '" placeholder = "' + value.descriptive_text + '">' + fillObj[key] + '</textarea></div>';
        show += '</div>';
    } );

    next( show );

}; // end addNewStep

/**
 * @name     buildInputTable
 * @desc     Function to build a complete input table, does not include a submit button,
 *           an example implementation:
 *           help.buildInputTable('user', thisUserObject, arrayPosition, '', templates, function(next) {
 *           $('#runTest').html(next); });
 * @param    item - the key of the item to be listed (e.g. project)
 * @param    fillObj - the object used to fill values previously saved (edit field only)
 * @param    arryPos - the object array position used for saving if the text_id field changes
 * @param    itemObject - the object of the item to be listed
 * @param    templates - the template object
 *           note: the template must include .collection with the collection associated with that template
 * @param    next_ - allows you to wait for response before continuing the rest of the program (a callback)
 * @returns  show an html table of the items requested
*/
let buildInputTable = function ( item, fillObj, templates, next_ ) {

    // initialize the variables to be used in this function
    let count = 0;
    let show = '';
    //console.log('fillObj', fillObj)
    // build table one row at the time, exit function when done
    for ( var key in templates[item] ) {
        buildInputTableRow( key, templates[item][key], fillObj, templates, function ( next ) {
            show += next;
            count++;
            //console.log(count, show)
            // don't exit until everything is received
            if ( count == Object.keys( templates[item] ).length ) {
                next_( show );
            }; // end if
        } );
    }; // end for
}; // end buildInputTable

/**
 * @name      getEntireCollection
 * @desc      Function to get an entire collection from the db. An example use:
 *            getEntireCollection(requirementCollection,
 *            { SRS_Trace: 1, SRS_Group: 1, Document_Number:1 }, function(next){});
 * @param     collection the collection to get
 * @param     dbFields the fields to get, can be {}
 * @returns   an array of the entire collection
 */
let getEntireCollection = function ( collection, dbFields, next ) {
    let completeCollection = [];

    // set the record limit and initialize the start
    let limit = 200;
    let last = 0;

    // jQuery AJAX call for JSON to see how many records are in the collection
    $.getJSON( 'parse/collectionsize/' + collection, function ( data ) {
        let max = data;
        //console.log('total records', max);

        // A local function to recursively get all the records
        function getAllRecords() {

            //console.log(completeCollection.length, max)
            // Base case if this is satisfied the function ends
            if ( completeCollection.length >= ( max - 1 ) ) {
                next( completeCollection );
                return;
            };

            $.ajax( {
                type: 'GET',
                data: { find: {}, proj: { skip: last, limit: limit, fields: dbFields } },
                url: 'parse/getrecords/' + collection,
                dataType: 'JSON'
            } ).done( function ( data ) {

                completeCollection = completeCollection.concat( data );
                //console.log('requirementlist data:', completeCollection);

                last = completeCollection.length;

                return getAllRecords();
            } );
        }; // end getAllRecords

        getAllRecords();

    } ); // end collectionsize
}; // end getEntireCollection

/**
 * @name      getLotsOfData
 * @desc      Function to get a large amount of data from the db. Results will be sorted with latest
 *            entries last, slower than asynchGetLotsOfData.
 *            An example use:
 *            getLotsOfData(requirementCollection, {},
 *            { SRS_Trace: 1, SRS_Group: 1, Document_Number:1 }, function(next){});
 * @param     collection the collection to get
 * @param     findCriteria the find criteria, can be {}, e.g. {tester: {$ne:null},
 *            completion_date:{$gte: new Date(startMonth).toISOString(), $lte: new Date().toISOString()}};
 * @param     dbFields the fields to get, can be {}, e.g. {completion_date: 1, tester: 1, _id: 0};
 * @returns   an array of the entire collection
 */
let getLotsOfData = function ( collection, findCriteria, dbFields, next ) {
    let completeCollection = [];

    // set the record limit and initialize the start
    let limit = 400;
    let last = 0;

    //console.log(findCriteria, dbFields)
    // jQuery AJAX call for JSON to see how many records are in the collection
    $.getJSON( 'parse/collectionsize/' + collection, function ( data ) {
        let max = data;
        //console.log('total records', max);

        // A local function to recursively get all the records
        function getLotsOfRecords() {

            //console.log( limit, max, last)
            // Base case if this is satisfied the function ends
            if ( last >= ( max - 1 ) ) {
                next( completeCollection );
                return;
            };
            //console.log(JSON.stringify( { find: findCriteria, proj: {skip: last, limit: limit, fields: dbFields} }))
            $.ajax( {
                type: 'GET',
                data: { find: findCriteria, proj: { skip: last, limit: limit, fields: dbFields } },
                url: 'parse/getrecords/' + collection,
                dataType: 'JSON'
            } ).done( function ( data ) {

                completeCollection = completeCollection.concat( data );
                //console.log('data:', completeCollection);

                last += limit;

                return getLotsOfRecords();
            } );
        }; // end getAllRecords

        getLotsOfRecords();

    } ); // end collectionsize
}; // end getLotsOfData

/**
 * @name      asynchGetLotsOfData
 * @desc      Function to get a large amount of data from the db. Results will not be sorted.
 *            you will have to sort them. Faster than getLotsOfData.
 *            An example use:
 *            help.asynchGetLotsOfData(requirementCollection, {},
 *            { SRS_Trace: 1, SRS_Group: 1, Document_Number:1 }, function(next){});
 * @param     collection the collection to get
 * @param     findCriteria the find criteria, can be {}, e.g. {tester: {$ne:null},
 *            completion_date:{$gte: new Date(startMonth).toISOString(), $lte: new Date().toISOString()}};
 * @param     dbFields the fields to get, can be {}, e.g. {completion_date: 1, tester: 1, _id: 0};
 * @returns   an array of the entire collection
 */
let asynchGetLotsOfData = function ( collection, findCriteria, dbFields, next ) {
    let completeCollection = [];

    // set the record limit and initialize the start
    let limit = 400;
    let last = 0;

    //console.log(findCriteria, dbFields)
    // jQuery AJAX call for JSON to see how many records are in the collection
    $.getJSON( 'parse/collectionsize/' + collection, function ( data ) {
        let max = data;
        //console.log('total records', max);

        for( let i = 0; i < max - 1; i += limit ) {

            //console.log(JSON.stringify( { find: findCriteria, proj: {skip: i, limit: limit, fields: dbFields} }))
            $.ajax( {
                type: 'GET',
                data: { find: findCriteria, proj: { skip: i, limit: limit, fields: dbFields } },
                url: 'parse/getrecords/' + collection,
                dataType: 'JSON'
            } ).done( function ( data ) {

                completeCollection = completeCollection.concat( data );
                //console.log('data:', completeCollection);

                last += limit;

                if( last > max - 1 ){
                    next( completeCollection )
                };

            } );
        };
    } ); // end collectionsize
}; // end asynchGetLotsOfData

/*  Return number of days between d0 and d1.
**  Returns positive if d0 < d1, otherwise negative. See:
**  https://stackoverflow.com/questions/7763327/how-to-calculate-date-difference-in-javascript
**  e.g. between 2000-02-28 and 2001-02-28 there are 366 days
**       between 2015-12-28 and 2015-12-29 there is 1 day
**       between 2015-12-28 23:59:59 and 2015-12-29 00:00:01 there is 1 day
**       between 2015-12-28 00:00:01 and 2015-12-28 23:59:59 there are 0 days
**
**  @param {Date} d0  - start date
**  @param {Date} d1  - end date
**  @returns {number} - whole number of days between d0 and d1
**
*/
let daysDifference = function ( d0, d1 ) {
    var diff = new Date( +d1 ).setHours( 12 ) - new Date( +d0 ).setHours( 12 );
    return Math.abs( Math.round( diff / 8.64e7 ) );
};

/**
 * @name     findAverage
 * @desc     This function calculates the average of an array
 * @param    array the array
 * @returns
 */
let findAverage = function ( array ) {
	if ( array && array.length > 0 ) {
		let average = array.reduce( ( a, b ) => a + b ) / array.length
		return average.toFixed( 1 );
	} else {
		return '';
	};
};// end findAverage

/**
 * @name     getOccurrence
 * @desc     This function calculates the total of a value in an array
 * @param    array the array
 * @param    value the value to search for
 * @returns
 */
let getOccurrence = function( array, value ) {
    let result = array.filter( ( v ) => ( v === value ) ).length;
    return result
}; // getOccurence

module.exports = {
    'addNewStep': addNewStep,
    'asynchGetLotsOfData': asynchGetLotsOfData,
    'buildInputTable': buildInputTable,
    'buildInputTableRow': buildInputTableRow,
    'daysDifference': daysDifference,
    'findAndShowImage': findAndShowImage,
    'findAverage': findAverage,
    'getEntireCollection': getEntireCollection,
    'getLotsOfData': getLotsOfData,
    'getOccurrence': getOccurrence,
    'getStrings': getStrings,
    'getTemplates': getTemplates,
    'noUndef': noUndef,
    'objTable': objTable,
};
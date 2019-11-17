/**
 * @file          help.js
 * @author        Jacob Kearns
 * @fileOverview  The helpers javascript file for this app.
*/

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
 * @name      getEntireCollection
 * @desc      Function to get an entire collection from the db. An example use:
 *            getEntireCollection(requirementCollection,
 *            { Document_Number:1 }, function(next){});
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

module.exports = {
    'getEntireCollection': getEntireCollection,
    'noUndef': noUndef,
};
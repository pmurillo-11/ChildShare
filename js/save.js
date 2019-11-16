/**
 * @file          save.js
 * @author        Jacob Kearns
 * @fileOverview  The save helpers javascript file for this app.
*/

/**
 * @name      newScript
 * @desc      Saves a new entry.
 * @param     urlAndCollection - the URL collection to save too, e.g. 'parse/addscript/' + scriptlist, figure out the path
 * @param     entry - the Object being updated
 * @param     next - allows you to wait for response before continuing the rest of the program (a callback)
 * @returns   response - the json object, should be same as objectTemplates.json
*/
let newScript = function(urlAndCollection, entry, next) {

    // Use AJAX to post the object to our service
    $.ajax({
        type: 'POST',
        data: entry,
        url: urlAndCollection,
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {
        next(entry);

        } else {
        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);
        next();
        }; // end else
    }); // end done

}; // end newScript

/**
 * @name      saveEntry
 * @desc      Saves the new or modified entry, note, for this to work button naming / id
 *            is very important, it must contain 'Add' or 'Edit' as appropriate, an example:
 *            save.saveEntry('test', templates, event, function(next) { });
 *            This function should not allow the creation of records with duplicate or blank fields
 *            which have been designated as the text_id field (e.g. project.name).
 *            This function should not allow the creation of completely blank records, to accomplish
 *            this the variable blankCheck is used to ensure at least one field is not blank.
 * @param     item - the key of the item to be listed (e.g. project)
 * @param     templates - the template object
 * @param     thisObject - the Object being updated, if it is a new addition it will be blank
 * @param     event - the button event, contains info about which button was pressed
 * @param     next - allows you to wait for response before continuing the rest of the program (a callback)
 * @returns   response - the json object, should be same as objectTemplates.json
*/
let saveEntry = function(item, thisObject, templates, event, next) {

    console.log('thisObject', thisObject);

    // Object for the new or updated entry
    let entry = {};
    entry.steps = [];

    // find all text areas on the web page, assign to array
    let textareaList = document.getElementsByTagName("textarea");
    // iterate through the array to get the items to save
    for( let i = 0; i < textareaList.length; i++ ){

        if (textareaList[i].id.includes('steps.')) {

            let split = textareaList[i].id.split('.');

            if ( !entry.steps[split[1]] ) {
                entry.steps.push({});
            }

            entry.steps[split[1]][split[2]] = textareaList[i].value.trim();


        } else if( textareaList[i].id.includes('.') ) {

            //console.log( textareaList[i].id, entry, setObjByString(entry, textareaList[i].id, textareaList[i].value.trim()) )
            setObjByString(entry, textareaList[i].id, textareaList[i].value.trim());

        } else {
            entry[textareaList[i].id] = textareaList[i].value.trim();
        }

    }; // end for loop

    entry._id = thisObject._id;
    //console.log('entry', entry);
    //console.log ('steps:', entry.steps, Array.isArray( entry.steps ) );
    // save the old entry in the deleted items db before writing the new one
    saveOldEntry(entry, templates[item].collection, function(){

      // Use AJAX to post the object to our edit service
      $.ajax({
        type: 'PUT',
        data: entry,
        url: '../parse/editscript/' + templates[item].collection,
        dataType: 'JSON'
      }).done(function( response ) {
        //console.log('response:', response);

        // Check for successful response
        if (response.nModified == '1') {
          // add timeout to address AUT-1391
          setTimeout(() => {
            next(entry);
          }, 50);

        } else {
          // If something goes wrong, alert the error message that our service returned
          //alert('Not modified, probably because nothing changed: \n' + JSON.stringify(response));
          next();
        };
      }); // end done

    }); // end saveOldEntry

}; // end saveEntry

/**
 * @name      saveOldEntry
 * @desc      Function to save an entry to the deleted collection database before it is updated.
 *            adds the old _id and the date changed to the object
 * @param     obj - the object being saved, must include _id field
 * @param     collection - the collection that the record belongs to
 * @param     next - a callback, it is blank
 * @returns
*/
let saveOldEntry = function(obj, collection, next) {

    //console.log(obj, collection);
    let find = { _id: obj._id };

    $.ajax({
      type: 'GET',
      data: find,
      url: '../parse/getrecords/' + collection,
      dataType: 'JSON'
    }).done(function( res ) {
      //console.log('saveOldEntry - Get:', obj._id, ' response:', res);
      // Check for response, note since we are searching by id, there should only be one response
      if ( res ) {
        // first save old id
        res[0].old_id = res[0]._id;
        // then delete id from object
        delete res[0]._id;
        // save the collection
        res[0].old_collection = collection;
        // add date changed to object
        res[0].changed_date = new Date();
        //console.log('saveOldEntry - Get:', obj._id, ' response:', res);

        // now save it to the deleted records database
        let deletedCollection = 'deletedRecords';

        $.ajax({
          type: 'POST',
          data: res[0],
          url: '../parse/addscript/' + deletedCollection,
          dataType: 'JSON',
          //traditional: true
        }).done(function( response ) {

        // Check for a successful (blank) response
          if (response.msg === '') {
          } else {
            alert('Error: ' + JSON.stringify(response));
          };
        });

        // I don't think we need to wait for the write operation to finish
        // to continue the previous task
        // add timeout to address AUT-1391
        setTimeout(() => {
            next();
        }, 50);

      } else {
        alert('Error: ' + response.msg);
      }
    });
  }; // end saveOldEntry

// https://stackoverflow.com/questions/10934664/convert-string-in-dot-notation-to-get-the-object-reference
let setObjByString = function(obj, str, val) {
    var keys, key;
    //make sure str is a string with length
    if (!str || !str.length || Object.prototype.toString.call(str) !== "[object String]") {
        return false;
    }
    if (obj !== Object(obj)) {
        //if it's not an object, make it one
        obj = {};
    }
    keys = str.split(".");
    while (keys.length > 1) {
        key = keys.shift();
        if (obj !== Object(obj)) {
            //if it's not an object, make it one
            obj = {};
        }
        if (!(key in obj)) {
            //if obj doesn't contain the key, add it and set it to an empty object
            obj[key] = {};
        }
        obj = obj[key];
    }
    //console.log('137', obj[keys[0]] = val);
    return obj[keys[0]] = val;
}; // end setObjByString

module.exports = {
    'newScript': newScript,
    'saveEntry': saveEntry,
    'saveOldEntry': saveOldEntry
};
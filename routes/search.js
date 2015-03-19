/**
 *
 * make a search in Evernote
 * @author frankxin
 * @create 2015.3.17
 * 
 */

var Evernote = require('evernote').Evernote,
    config = require('../config.json');

var client = new Evernote.Client({
	token: config.developerToken_for_sandbox
});

var keyword = '';

var noteStore = client.getNoteStore();

exports.index = function(req , res){

	keyword = req.query.searchData;

	var noteFilter = new Evernote.NoteFilter();
	noteFilter.words = keyword;
	noteFilter.ascending = false;
	noteFilter.inactive = false;

	noteStore.findNotes(noteFilter, 0, 20, function(err , response){
		if(err) {
			console.log(err);
		} else {
			console.log(response);
		}
	})

}
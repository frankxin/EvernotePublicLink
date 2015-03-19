/**
 *
 *Get note content and resource by Guid.
 *And store it in mongodb
 * 
 */

var Evernote = require('evernote').Evernote,
    config = require('../config.json'),
    mongo = require('./mongo.js');

var client = new Evernote.Client({
	token: config.developerToken_for_sandbox
});

var webApiUrlPrefix = '';
var guid,content,title;
var noteStore = client.getNoteStore();

// //init and connect to mongo db
// var mon = mongo.connect(),
// 	mongoose = mon.mongoose,
//     db = mon.db;

var getNote = function(Guid , res){

	noteStore.getNote(Guid, true, true, true, false, function(err, note) {

		while (note) {
			console.log(note);
			processContent(note, res);
			break;
		};

	});

}

var processContent = function(note, res){

	var patternEnNote = /<en-note[^>]*/i,
		patternEnMedia = /(<en-media[^<]+<\/en-media>)/ig;

	var content = note.content,
		resource = note.resources,
		out = content.match(patternEnNote),
		startIndex = out.index + out[0].length,
		endIndex = content.lastIndexOf("</en-note>"),
		body = content.substring(startIndex, endIndex);

	//replace the en-media
	var newContent = body.replace(patternEnMedia, function(match, pos, originalText) {
		var patternHash = /hash=\"([0-9a-f]+)\"/,
			patternStyle = /style=\"[^"]+\"/i,
			style;

		var key = match.match(patternHash),
			hash = key[1];
		//match the style of img
		var styleIsNuLL = match.match(patternStyle);

		if (styleIsNuLL != null) {
			style = styleIsNuLL;
		} else {
			style = '';
		}

		for (var i = 0; i < resource.length; i++) {
			var toHexHash = toHex(resource[i].data.bodyHash);
			if (toHexHash == hash) {
				var imgBlock = makeImgUrl(webApiUrlPrefix, resource[i].guid, style);
				return imgBlock;
			};
		};
	});
	//prepare a entire content to render
	var allContent = "<div " + newContent + "</div>";

	console.log(allContent);
	res.send(allContent);

}

/*10 system to 16 system*/
Number.prototype.toHexString = function() {
	return this.toString(16);
}

/*handle bodyHash to String*/
var toHex = function(data) {
	var char = [];
	for (var i = 0; i < data.length; i++) {
		var d = data[i];
		char[i * 2] = Math.floor(d / 16).toHexString(); //why i have to devide by 16
		char[i * 2 + 1] = (d % 16).toHexString();
	};
	return char.join('');
};

/*construct the img Url*/
var makeImgUrl = function(urlPrefix, guid, style) {

	//if i don't login i must send developerToken
	var s = "<img src=\"" + urlPrefix + "res/" + guid + '?auth=' + config.developerToken + "\" " + style + " />";
	console.log(s);
	return s;

}
//mongoose.saveToDB(guid,content,title);

//render(something);

exports.share = function(req, res){

	guid = req.query.guid;
	getNote(guid, res);

}
var Evernote = require('evernote').Evernote,
    config = require('../config.json');

var client = new Evernote.Client({
	token: config.developerToken_for_sandbox
});

var userStore = client.getUserStore();

exports.index = function(){
	userStore.getUser(function(err , User){
		if (err) {
			console.log(err);
		} else {
			console.log(User);
			console.log(User.id + '\n');
			console.log(User.username + '\n');
			console.log(User.name + '\n');
			console.log(User.email + '\n');
		}
	})
}

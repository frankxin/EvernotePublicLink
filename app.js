var express = require('express'),
	methodOverride = require('method-override'),
	expressSession = require('express-session'),
	cookieParser = require('cookie-parser'),
	Oauth = require('./routes/oauth'),
	searchInput = require('./routes/search'),
	shareNote = require('./routes/share'),
	getUser = require('./routes/user');

var app = express();

//add-on middleware
app.use(methodOverride());
app.use(cookieParser('secret'));
app.use(expressSession({secret: 'secret'}));
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

//a test Router
app.get('/' , function(req, res){
	res.send('Hello world');
});
app.get('/oauth',Oauth.oauth);
app.get('/oauth_callback', Oauth.oauth_callback);
app.get('/input',searchInput.index);
app.get('/share',shareNote.share);
app.get('/user',getUser.index);





var server = app.listen(3000 , function(){

	var host = server.address().address ,
	    family = server.address().family ,
	    port = server.address().port;

	console.log('app listening at ' + host + '/' + port + '/' + family);
});

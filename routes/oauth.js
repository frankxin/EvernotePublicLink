/**
 *  oAuth access
 *  @author frankxin
 *  @create 2015.3.17
 */
var Evernote = require('evernote').Evernote,
    config = require('../config.json'),
    callbackUrl = "http://127.0.0.1:3000/oauth_callback";

exports.oauth = function(req , res){

	var client = new Evernote.Client({
		consumerKey: config.consumer_key ,
		consumerSecret: config.consumer_secret,
		sanbox: config.isSandbox
	});

	client.getRequestToken(callbackUrl, 
	function(error, oauthToken, oauthTokenSecret, results){

	    if(error) {
	      req.session.error = JSON.stringify(error);
	      res.redirect('/');
	    }
	    else { 
	      // store the tokens in the session
	      console.log(req.session);
	      req.session.oauthToken = oauthToken;
	      req.session.oauthTokenSecret = oauthTokenSecret;
	      console.log(oauthToken + '\n');
	      console.log(oauthTokenSecret + '\n');

	      // redirect the user to authorize the token
	      res.redirect(client.getAuthorizeUrl(oauthToken));
	      
	    }
	    
  	});

}

exports.oauth_callback = function(req , res){

	var client = new Evernote.Client({
		consumerKey: config.consumer_key ,
		consumerSecret: config.consumer_secret,
		sanbox: config.isSandbox
	});

	client.getAccessToken(
		req.session.oauthToken,
		req.session.oauthTokenSecret,
		req.query.oauth_verifier,
		function(err, oauthAccessToken, oauthAccessTokenSecret, results){
			if (err) {
				console.log(err);
				res.redirect('/');
			} else {
				console.log(oauthAccessToken + '\n');
				console.log(oauthAccessTokenSecret + '\n');
				console.log(results.edam_shard + '\n');
				console.log(results.edam_userId + '\n');
				console.log(results.edam_expires + '\n');
				console.log(results.edam_noteStoreUrl + '\n');
				console.log(results.edam_webApiUrlPrefix + '\n');
				req.session.oauthAccessToken = oauthAccessToken;
		        req.session.oauthAccessTtokenSecret = oauthAccessTokenSecret;
		        req.session.edamShard = results.edam_shard;
		        req.session.edamUserId = results.edam_userId;
		        req.session.edamExpires = results.edam_expires;
		        req.session.edamNoteStoreUrl = results.edam_noteStoreUrl;
		        req.session.edamWebApiUrlPrefix = results.edam_webApiUrlPrefix;
		        res.redirect('/');
			}
		})
}

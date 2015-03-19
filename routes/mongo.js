/**
 * 
 * mongoose test demo
 * @author frankxin
 * @create 2015.3.17
 * 
 */

exports.connect = function(){
	var mongoose = require('mongoose');
	
	//frank is a test database
    mongoose.connect('mongodb://localhost/frank');

    return {
    	mongoose: mongoose,
    	db : mongoose.connection
    };
}

var mongoose = require('mongoose');

//frank is a test database
mongoose.connect('mongodb://localhost/frank');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function(callback) {
	console.log('yeah') // yay!
	var kittySchema = mongoose.Schema({
		name: String,
		age: Number
	})
	kittySchema.methods.speak = function() {
		var greeting = this.name ? "Meow name is " + this.name : "I don't have a name"
		console.log(greeting);
	}
	var Kitten = mongoose.model('Kitten', kittySchema)
	var fluffy = new Kitten({
		name: 'frank',
		age: '66'
	});
	fluffy.save(function(err, fluffy) {
		if (err) return console.error(err);
		fluffy.speak();
	});

});
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var express = require('express');
var app = express();

var nannies = require('./routes/nannies');
//mongoose.connect('mongodb://localhost/mynounou');
//var nannySchema = new Schema({
//	name: String,
//})
//var Nanny = mongoose.model('Nanny', nannySchema);
//
//var nannyExample = new Nanny({
//	name: 'Myriam'
//});
//
//nannyExample.save();
//
//Nanny.find(function(err, nannies){
//	console.info(nannies);
//});

app.use('/nannies', nannies);

app.get('/', function(req, res){
	res.status(200).json({test: 'test'});
});

app.listen(8080, function() {
	console.log('Server running on port 8080...');
});
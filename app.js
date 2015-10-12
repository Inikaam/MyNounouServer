var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mynounou');

var express = require('express');
var app = express();


var nannies = require('./routes/nannies');


app.use('/nannies', nannies);

app.get('/', function(req, res){
	res.status(200).json({test: 'test'});
});

app.listen(8080, function() {
	console.log('Server running on port 8080...');
});
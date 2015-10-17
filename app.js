var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mynounou');

var express = require('express');
var app = express();


var nannies = require('./routes/nannies');
var parents = require('./routes/parents');
var chats = require('./routes/chats');


app.use('/nannies', nannies);
app.use('/parents', parents);
app.use('/chats', chats);

app.listen(8080, function() {
	console.log('Server running on port 8080...');
});
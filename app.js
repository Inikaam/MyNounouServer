/**
 * Packages
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

/**
 * App packages
 */
var config = require('./security/config');
var nannies = require('./routes/nannies');
var parents = require('./routes/parents');
var chats = require('./routes/chats');
var authenticate = require('./routes/authenticate');

/**
 * Config
 */
mongoose.connect(config.database);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Routes
 */
app.use('/api', authenticate);
app.use('/api/nannies', nannies);
app.use('/api/parents', parents);
app.use('/api/chats', chats);

// TODO : retirer ce point d'entrée de test
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.listen(8080, function() {
	console.log('Server running on port 8080...');
});

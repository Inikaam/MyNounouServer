/**
 * Packages
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

/**
 * App packages
 */
var config = require('./security/config');
var nannies = require('./routes/nannies');
var parents = require('./routes/parents');
var chats = require('./routes/chats');

/**
 * Config
 */
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Routes
 */
app.use('/api/nannies', nannies);
app.use('/api/parents', parents);
app.use('/api/chats', chats);

app.listen(8080, function() {
	console.log('Server running on port 8080...');
});
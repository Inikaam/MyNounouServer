var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({
    extended : false
});

router.route('/')
	.get(function(req, res){
	    res.json({nannies: 'nannies'});
	})
	.post(parseUrlencoded, function(req, res){
	    res.send(req.body.name);
	});

module.exports = router;
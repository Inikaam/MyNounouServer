var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({
	extended : false
});
var Nanny = require('../models/Nanny');

router.route('/')
	.get(function(req, res) {
		Nanny.find(function(err, nannies) {
			res.json(nannies);
		});
	})
	.post(parseUrlencoded, function(req, res) {
		var isValid = true;
	
		for (var index in req.body) {
			isValid &= (req.body[index] != "" && req.body[index] != null);
		}
	
		if (isValid) {
			var newNanny = new Nanny(req.body);
			newNanny.save(function(err){
				if (err) {
					var errors = {};
					for(var i in err.errors) {
						errors[i] = err.errors[i].message;
					}
					res.send(errors);
				}
				else {
					res.json(newNanny);
				}
			});
		} else {
			res.send('Champs invalides !');
		}
	});



// var nannyExample = new Nanny({
// name: 'Myriam'
// });
//
// nannyExample.save();
//
// Nanny.find(function(err, nannies){
// console.info(nannies);
// });

module.exports = router;
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
					res.status(400).send(errors);
				}
				else {
					res.status(201).json(newNanny);
				}
			});
		} else {
			res.send('Champs invalides !');
		}
	});

router.route('/:id')
	.all(function(req, res, next) {
		id = req.params.id;
		if(! /[0-9a-f]{24}/i.test(id)) {
			res.sendStatus(400);
		} else {
			next();
		}
	})
	.get(function(req, res) {
		id = req.params.id;
		
		Nanny.findById(id, function (err, nanny){
			if (err)
				res.send('Error');
			else if(!nanny)
				res.status(404).send("Aucune nounou trouvée.")
			else 
				res.json(nanny);
		});
	})
	.put(parseUrlencoded, function(req, res) {
		id = req.params.id;
		var isValid = true;
		for (var index in req.body) {
			isValid &= (req.body[index] != "" && req.body[index] != null);
		}
		
		if (isValid) {
			Nanny.findByIdAndUpdate(id, {$set: req.body}, function(err, nanny){
				if(err)
					res.send('Error');
				else {
					if(! nanny)
						res.status(404).send("Aucune nounou trouvée.");
					else {
						res.sendStatus(200);
					}
				}
			});
		}
	})
	.delete(function(req, res) {
		id = req.params.id;
		
		Nanny.remove({_id: id}, function(err){
			if(err)
				res.send('Error')
			else
				res.sendStatus(200);
		});
	});

module.exports = router;
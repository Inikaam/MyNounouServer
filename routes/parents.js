var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({
	extended : false
});
var Parent = require('../models/Parent');

router.route('/')
	.get(function(req, res) {
		Parent.find(function(err, parents) {
			res.json(parents);
		});
	})
	.post(parseUrlencoded, function(req, res) {
		var isValid = true;
	
		for (var index in req.body) {
			isValid &= (req.body[index] != "" && req.body[index] != null);
		}
	
		if (isValid) {
			var newParent = new Parent(req.body);
			newParent.save(function(err){
				if (err) {
					var errors = {};
					for(var i in err.errors) {
						errors[i] = err.errors[i].message;
					}
					res.status(400).send(errors);
				}
				else {
					res.status(201).json(newParent);
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
		
		Parent.findById(id, function (err, parent){
			if (err)
				res.send('Error');
			else if(!parent)
				res.status(404).send("Aucun parent trouvé.")
			else 
				res.json(parent);
		});
	})
	.put(parseUrlencoded, function(req, res) {
		id = req.params.id;
		var isValid = true;
		for (var index in req.body) {
			isValid &= (req.body[index] != "" && req.body[index] != null);
		}
		
		if (isValid) {
			Parent.findByIdAndUpdate(id, {$set: req.body}, function(err, parent){
				if(err)
					res.send('Error');
				else {
					if(! parent)
						res.status(404).send("Aucun parent trouvé.");
					else {
						res.sendStatus(200);
					}
				}
			});
		}
	})
	.delete(function(req, res) {
		id = req.params.id;
		
		Parent.remove({_id: id}, function(err){
			if(err)
				res.send('Error')
			else
				res.sendStatus(200);
		});
	});

module.exports = router;
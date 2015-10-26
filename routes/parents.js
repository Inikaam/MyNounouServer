var express = require('express');
var router = express.Router();

var ValidatorHelper = require('../helpers/Validator');
var Parent = require('../models/Parent');

router.route('/')
	.get(function(req, res) {
		Parent.find(function(err, parents) {
			res.json(parents);
		});
	});

router.route('/:id')
	.all(function(req, res, next) {
		id = req.params.id;
		if(! ValidatorHelper.isMongoId(id)) {
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
	.put(function(req, res) {
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
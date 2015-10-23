var express = require('express');
var router = express.Router();

var ValidatorHelper = require('../helpers/Validator');
var Nanny = require('../models/Nanny');

router.route('/')
	.get(function(req, res) {
		Nanny.find({}, {password: 0}, function(err, nannies) {
			res.json(nannies);
		});
	})
	.post(function(req, res) {
		var isValid = true;

		var newNanny = new Nanny(req.body);
		newNanny.save(function(err){
			if (err) {
				var errors = {};
				for(var i in err.errors) {
					errors[i] = err.errors[i].message;
				}
				res.status(400).json(errors);
			}
			else {
				res.status(201).json(newNanny);
			}
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

		Nanny.findById(id, function (err, nanny){
			if (err)
				res.send('Error');
			else if(!nanny)
				res.status(404).send("Aucune nounou trouvée.")
			else
				res.json(nanny);
		});
	})
	.put(function(req, res) {
		id = req.params.id;
		var updateNanny = req.body;

		if(updateNanny.comments);

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

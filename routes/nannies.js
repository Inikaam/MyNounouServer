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

		delete updateNanny.comments;
		delete updateNanny.dispos;
		delete updateNanny.restrictions;

		Nanny.findByIdAndUpdate(id, {$set: updateNanny}, function(err, nanny) {
			if(err)
				res.send('Error');
			else {
				if(! nanny)
					res.status(404).send("Aucune nounou trouvée.");
				else {
					Nanny.findById(id, function(err, nanny){
						res.status(200).json(nanny);
					});
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

router.route('/:id/comments')
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
		Nanny.findById(id, {comments: 1}, function(err, nanny) {
			if(err)
				res.sendStatus(500);
			else
				res.status(200).json(nanny.comments);
		});
	})
	.post(function(req, res) {
		id = req.params.id;
			
		Nanny.findByIdAndUpdate(id, {$push: {comments: req.body}}, function(err, nanny){
			if(err)
				res.sendStatus(500);
			else {
				Nanny.findById(id, {comments: 1}, function(err, nanny) {
					if(err)
						res.sendStatus(500);
					else
						res.status(200).json(nanny.comments);
				});
			}
		});

	});

router.route('/:id/comments/:commentId')
	.all(function(req, res, next) {
		id = req.params.id;
		commentId = req.params.commentId;
		if(! ValidatorHelper.isMongoId(id) || ! ValidatorHelper.isMongoId(commentId)) {
			res.sendStatus(400);
		} else {
			next();
		}
	})
	.delete(function(req, res) {
		id = req.params.id;
		commentId = req.params.commentId;
		
		Nanny.findById(id, function(err, nanny) {
			if(err)
				res.sendStatus(500);
			else {
				nanny.comments.id(commentId).remove();
				nanny.save(function(err) {
					if(err)
						res.sendStatus(500);
					else 
						res.status(200).send(true);
				})
			}
		})
	});

module.exports = router;

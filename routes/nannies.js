var express = require('express');
var router = express.Router();

var ValidatorHelper = require('../helpers/Validator');
var Nanny = require('../models/Nanny');

router.route('/')
	.get(function(req, res) {
		Nanny.find({}, {password: 0}, function(err, nannies) {
			res.status(200).json(nannies);
		});
	});

router.route('/:id')
	.all(function(req, res, next) {
		var id = req.params.id;
		if(! ValidatorHelper.isMongoId(id)) {
			res.status(400).send('ID incorrect.');
		} else {
			Nanny.findById(id, function (err, nanny){
				if(err)
					res.status(500).send(err);
				else if(! nanny)
					res.status(404).send('Aucune nounou trouvée.');
				else 
					next();
			});
		}
	})
	.get(function(req, res) {
		var id = req.params.id;

		Nanny.findById(id, function (err, nanny){
			if (err)
				res.status(500).send(err);
			else
				res.status(200).json(nanny);
		});
	})
	.put(function(req, res) {
		var id = req.params.id;
		var updateNanny = req.body;

		delete updateNanny.comments;
		delete updateNanny.dispos; // TODO : gérer le SET des dispos
		delete updateNanny.restrictions;

		Nanny.findByIdAndUpdate(id, {$set: updateNanny}, function(err, nanny) {
			if (err)
				res.status(500).send(err);
			else {
				
				Nanny.findById(id, function(err, nanny){
					if (err)
						res.status(500).send(err);
					else
						res.status(200).json(nanny);
				});
			}
		});

	})
	.delete(function(req, res) {
		var id = req.params.id;

		Nanny.remove({_id: id}, function(err){
			if (err)
				res.status(500).send(err);
			else
				res.status(200).send('La nounou a bien été supprimée.');
		});
	});

router.route('/:id/comments')
	.all(function(req, res, next) {
		var id = req.params.id;
		if(! ValidatorHelper.isMongoId(id)) {
			res.status(400).send('ID incorrect.');
		} else {
			Nanny.findById(id, function (err, nanny){
				if(err)
					res.status(500).send(err);
				else if(! nanny)
					res.status(404).send('Aucune nounou trouvée.');
				else 
					next();
			});
		}
	})
	.get(function(req, res) {
		var id = req.params.id;
		Nanny.findById(id, {comments: 1}, function(err, nanny) {
			if (err)
				res.status(500).send(err);
			else
				res.status(200).json(nanny.comments);
		});
	})
	.post(function(req, res) {
		var id = req.params.id;
			
		Nanny.findByIdAndUpdate(id, {$push: {comments: req.body}}, function(err, nanny){
			if (err)
				res.status(500).send(err);
			else {
				Nanny.findById(id, {comments: 1}, function(err, nanny) {
					if (err)
						res.status(500).send(err);
					else
						res.status(200).json(nanny.comments);
				});
			}
		});

	});

router.route('/:id/comments/:commentId')
	.all(function(req, res, next) {
		var id = req.params.id;
		var commentId = req.params.commentId;
		if(! ValidatorHelper.isMongoId(id) || ! ValidatorHelper.isMongoId(commentId)) {
			res.status(400).send('ID incorrect.');
		} else {
			Nanny.findById(id, function (err, nanny){
				if(err)
					res.status(500).send(err);
				else if(! nanny)
					res.status(404).send('Aucune nounou trouvée.');
				else {
					if(! nanny.comments.id(commentId))
						res.status(404).send('Ce commentaire n\'existe pas.');
					else
						next();
				}
			});
		}
	})
	.get(function(req, res) {
		var id = req.params.id;
		var commentId = req.params.commentId;
		Nanny.findById(id, {comments: 1}, function(err, nanny) {
			if (err)
				res.status(500).send(err);
			else
				res.status(200).json(nanny.comments.id(commentId));
		});
	})
	.delete(function(req, res) {
		var id = req.params.id;
		var commentId = req.params.commentId;
		
		Nanny.findById(id, function(err, nanny) {
			if (err)
				res.status(500).send(err);
			else {
				nanny.comments.id(commentId).remove();
				nanny.save(function(err) {
					if (err)
						res.status(500).send(err);
					else 
						res.status(200).send(true);
				});
			}
		});
	});

router.route('/:id/restrictions')
	.all(function(req, res, next) {
		var id = req.params.id;
		if(! ValidatorHelper.isMongoId(id)) {
			res.sendStatus(400);
		} else {
			Nanny.findById(id, function (err, nanny){
				if(err)
					res.status(500).send(err);
				else if(! nanny)
					res.status(404).send('Aucune nounou trouvée.');
				else 
					next();
			});
		}
	})
	.get(function(req, res) {
		var id = req.params.id;
		Nanny.findById(id, {restrictions: 1}, function(err, nanny) {
			if (err)
				res.status(500).send(err);
			else
				res.status(200).json(nanny.restrictions);
		});
	})
	.post(function(req, res) {
		var id = req.params.id;
		
		Nanny.findByIdAndUpdate(id, {$push: {restrictions: req.body}}, function(err, nanny){
			if(err)
				res.status(500).send(err);
			else {
				Nanny.findById(id, {restrictions: 1}, function(err, nanny) {
					if (err)
						res.status(500).send(err);
					else
						res.status(200).json(nanny.restrictions);
				});
			}
		});
	});

router.route('/:id/restrictions/:restrictionId')
	.all(function(req, res, next) {
		var id = req.params.id;
		var restrictionId = req.params.restrictionId;
		if(! ValidatorHelper.isMongoId(id) || ! ValidatorHelper.isMongoId(restrictionId)) {
			res.sendStatus(400);
		} else {
			Nanny.findById(id, function (err, nanny){
				if(err)
					res.status(500).send(err);
				else if(! nanny)
					res.status(404).send('Aucune nounou trouvée.');
				else {
					if(! nanny.restrictions.id(restrictionId))
						res.status(404).send('Cette restriction n\'existe pas.');
					else
						next();
				}
			});
		}
	})
	.get(function(req, res) {
		var id = req.params.id;
		var restrictionId = req.params.restrictionId;
		Nanny.findById(id, {restrictions: 1}, function(err, nanny) {
			if(err)
				res.status(500).send(err);
			else
				res.status(200).json(nanny.restrictions.id(restrictionId));
		});
	})
	.put(function(req, res) {
		var id = req.params.id;
		var restrictionId = req.params.restrictionId;
		
		var updateObj = {$set: {}};
		
		for(var i in req.body) {
			updateObj.$set["restrictions.$."+i] = req.body[i];
		}
		
		Nanny.update({_id: id, 'restrictions._id': restrictionId}, updateObj, 
			function(err, numAffected){
				if(err)
					res.status(500).send(err);
				else {
					Nanny.findById(id, function(err, nanny) {
						if(err)
							res.status(500).send(err);
						else
							res.status(200).json(nanny.restrictions.id(restrictionId));
					});
				}
			});

	})
	.delete(function(req, res) {
		var id = req.params.id;
		var restrictionId = req.params.restrictionId;
		
		Nanny.findById(id, function(err, nanny) {
			if(err)
				res.sendStatus(500);
			else {
				nanny.restrictions.id(restrictionId).remove();
				nanny.save(function(err) {
					if(err)
						res.send(err);
					else 
						res.status(200).send(true);
				});
			}
		});
	});

module.exports = router;

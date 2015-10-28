var express = require('express');
var router = express.Router();

var ValidatorHelper = require('../helpers/Validator');
var Nanny = require('../models/Nanny');

router.route('/')
	.get(function(req, res) {
		Nanny.find({}, {password: 0}, function(err, nannies) {
			res.status(200).json({success: true, message: "Liste des nounous obtenue.", data: nannies});
		});
	});

router.route('/:id')
	.all(function(req, res, next) {
		var id = req.params.id;
		if(! ValidatorHelper.isMongoId(id)) {
			res.status(400).json({success: false, message: "ID incorrect."});
		} else {
			Nanny.findById(id, function (err, nanny){
				if(err) 
					throw err;
				else if(! nanny)
					res.status(404).json({success: false, message: "Aucune nounou trouvée."});
				else 
					next();
			});
		}
	})
	.get(function(req, res) {
		var id = req.params.id;

		Nanny.findById(id, function (err, nanny){
			if (err)
				throw err;
			else
				res.status(200).json({success: true, message: "Nounou obtenue.", data: nanny});
		});
	})
	.put(function(req, res) {
		var id = req.params.id;
		var updateNanny = req.body;
		
		if(req.decoded._id != id) {
			res.status(403).json({success: false, message: "Vous n'êtes pas autorisé à modifier ce profil."});
		} else {
			delete updateNanny.comments;
			delete updateNanny.restrictions;
	
			Nanny.findByIdAndUpdate(id, {$set: updateNanny}, function(err, nanny) {
				if (err)
					throw err;
				else {
					
					Nanny.findById(id, function(err, nanny){
						if (err)
							throw err;
						else
							res.status(200).json({success: true, message: "Nounou mise à jour.", data: nanny});
					});
				}
			});
		}

	})
	.delete(function(req, res) {
		var id = req.params.id;
		if(req.decoded._id != id) {
			res.status(403).json({success: false, message: "Vous n'êtes pas autorisé à supprimer ce profil."});
		} else {
			Nanny.remove({_id: id}, function(err){
				if (err)
					throw err;
				else
					res.status(200).json({success: true, message: 'La nounou a bien été supprimée.'});
			});
		}
	});

router.route('/:id/comments')
	.all(function(req, res, next) {
		var id = req.params.id;
		if(! ValidatorHelper.isMongoId(id)) {
			res.status(400).json({success: false, message: "ID incorrect."});
		} else {
			Nanny.findById(id, function (err, nanny){
				if(err)
					throw err;
				else if(! nanny)
					res.status(404).json({success: false, message: "Aucune nounou trouvée."});
				else 
					next();
			});
		}
	})
	.get(function(req, res) {
		var id = req.params.id;
		Nanny.findById(id, {comments: 1}, function(err, nanny) {
			if (err)
				throw err;
			else
				res.status(200).json({success: true, message: "Liste des commentaires obtenu.", data: nanny.comments});
		});
	})
	.post(function(req, res) {
		var id = req.params.id;
			
		Nanny.findByIdAndUpdate(id, {$push: {comments: req.body}}, function(err, nanny){
			if (err)
				throw err;
			else {
				Nanny.findById(id, {comments: 1}, function(err, nanny) {
					if (err)
						throw err;
					else
						res.status(200).json({success: true, message: "Commentaire ajouté", data: nanny.comments});
				});
			}
		});

	});

router.route('/:id/comments/:commentId')
	.all(function(req, res, next) {
		var id = req.params.id;
		var commentId = req.params.commentId;
		if(! ValidatorHelper.isMongoId(id) || ! ValidatorHelper.isMongoId(commentId)) {
			res.status(400).json({success: false, message: "ID incorrect."});
		} else {
			Nanny.findById(id, function (err, nanny){
				if(err)
					throw err;
				else if(! nanny)
					res.status(404).json({success: false, message: "Aucune nounou trouvée."});
				else {
					if(! nanny.comments.id(commentId))
						res.status(404).json({success: false, message: "Ce commentaire n'existe pas."});
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
				throw err;
			else
				res.status(200).json({success: true, message: "Commentaire obtenu", data: nanny.comments.id(commentId)});
		});
	})
	.delete(function(req, res) {
		var id = req.params.id;
		var commentId = req.params.commentId;
		
		Nanny.findById(id, function(err, nanny) {
			if (err)
				throw err;
			else {
				nanny.comments.id(commentId).remove();
				nanny.save(function(err) {
					if (err)
						throw err;
					else 
						res.status(200).json({success: true, message: "Commentaire supprimé."});
				});
			}
		});
	});

router.route('/:id/restrictions')
	.all(function(req, res, next) {
		var id = req.params.id;
		if(! ValidatorHelper.isMongoId(id)) {
			res.status(400).json({success: false, message: "ID incorrect."});
		} else {
			Nanny.findById(id, function (err, nanny){
				if(err)
					throw err;
				else if(! nanny)
					res.status(404).json({success: false, message: "Aucune nounou trouvée."});
				else 
					next();
			});
		}
	})
	.get(function(req, res) {
		var id = req.params.id;
		Nanny.findById(id, {restrictions: 1}, function(err, nanny) {
			if (err)
				throw err;
			else
				res.status(200).json({success: true, message: "Liste des restrictions obtenue.", data: nanny.restrictions});
		});
	})
	.post(function(req, res) {
		var id = req.params.id;
		
		Nanny.findByIdAndUpdate(id, {$push: {restrictions: req.body}}, function(err, nanny){
			if(err)
				throw err;
			else {
				Nanny.findById(id, {restrictions: 1}, function(err, nanny) {
					if (err)
						throw err;
					else
						res.status(200).json({success: true, message: "Restriction ajoutée.", data: nanny.restrictions});
				});
			}
		});
	});

router.route('/:id/restrictions/:restrictionId')
	.all(function(req, res, next) {
		var id = req.params.id;
		var restrictionId = req.params.restrictionId;
		if(! ValidatorHelper.isMongoId(id) || ! ValidatorHelper.isMongoId(restrictionId)) {
			res.status(400).json({success: false, message: "ID incorrect."});
		} else {
			Nanny.findById(id, function (err, nanny){
				if(err)
					throw err;
				else if(! nanny)
					res.status(404).json({success: false, message: "Aucune nounou trouvée."});
				else {
					if(! nanny.restrictions.id(restrictionId))
						res.status(404).json({success: false, message: "Cette restriction n'existe pas."});
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
				throw err;
			else
				res.status(200).json({success: true, message: "Restriction obtenue.", data: nanny.restrictions.id(restrictionId)});
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
					throw err;
				else {
					Nanny.findById(id, function(err, nanny) {
						if(err)
							throw err;
						else
							res.status(200).json({success: true, message: "Restriction mise à jour.", data: nanny.restrictions.id(restrictionId)});
					});
				}
			});

	})
	.delete(function(req, res) {
		var id = req.params.id;
		var restrictionId = req.params.restrictionId;
		
		Nanny.findById(id, function(err, nanny) {
			if(err)
				throw err;
			else {
				nanny.restrictions.id(restrictionId).remove();
				nanny.save(function(err) {
					if(err)
						throw err;
					else 
						res.status(200).json({success: true, message: "Restriction supprimée."});
				});
			}
		});
	});

module.exports = router;

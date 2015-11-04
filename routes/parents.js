var express = require('express');
var router = express.Router();

var ValidatorHelper = require('../helpers/Validator');
var Parent = require('../models/Parent');

router.route('/')
	.get(function(req, res) {
		var query = req.query;
		Parent.find(query, {password: 0}, function(err, parents) {
			res.status(200).json({success: true, message: "Liste des parents obtenue.", data: parents});
		});
	});

router.route('/:id')
	.all(function(req, res, next) {
		var id = req.params.id;
		if(! ValidatorHelper.isMongoId(id)) {
			res.status(400).json({success: false, message: "ID incorrect."});
		} else {
			Parent.findById(id, function (err, parent){
				if(err) 
					throw err;
				else if(! parent)
					res.status(404).json({success: false, message: "Aucun parent trouvé."});
				else 
					next();
			});
		}
	})
	.get(function(req, res) {
		var id = req.params.id;
	
		Parent.findById(id, function (err, parent){
			if (err)
				throw err;
			else
				res.status(200).json({success: true, message: "Parent obtenu.", data: parent});
		});
	})
	.put(function(req, res) {
		var id = req.params.id;
		var updateParent = req.body;
		
		if(req.decoded._id != id) {
			res.status(403).json({success: false, message: "Vous n'êtes pas autorisé à modifier ce profil."});
		} else {
			delete updateParent.comments;
			delete updateParent.restrictions;
	
			Parent.findByIdAndUpdate(id, {$set: updateParent}, function(err, parent) {
				if (err)
					throw err;
				else {
					
					Parent.findById(id, function(err, parent){
						if (err)
							throw err;
						else
							res.status(200).json({success: true, message: "Parent mis à jour.", data: parent});
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
			Parent.remove({_id: id}, function(err){
				if (err)
					throw err;
				else
					res.status(200).json({success: true, message: 'Le parent a bien été supprimé.'});
			});
		}
	});

router.route('/:id/favorites')
	.all(function(req, res, next) {
		var id = req.params.id;
		if(! ValidatorHelper.isMongoId(id)) {
			res.status(400).json({success: false, message: "ID incorrect."});
		} else if(req.decoded._id != id) {
			res.status(403).json({success: false, message: "Vous n'êtes pas autorisé à accéder à cette partie."});
		} else {
			
			Parent.findById(id, function (err, parent){
				if(err) 
					throw err;
				else if(! parent)
					res.status(404).json({success: false, message: "Aucun parent trouvé."});
				else 
					next();
			});
		}
	})
	.get(function(req, res) {
		var id = req.params.id;
		Parent.findById(id, function (err, parent){
			if(err) 
				throw err;
			else if(! parent)
				res.status(404).json({success: false, message: "Aucun parent trouvé."});
			else
				res.status(200).json({success: true, message: "Liste des favoris obtenue.", data: parent});
		});
	})
	.post(function(req, res) {
		var id = req.params.id;
		Parent.findByIdAndUpdate(id, {$push: {favorites: req.body.favorite}}, function(err, parent) {
			if (err)
				throw err;
			else {
				
				Parent.findById(id, function(err, parent){
					if (err)
						throw err;
					else
						res.status(201).json({success: true, message: "Favori ajouté.", data: parent.favorites});
				});
			}
		});
	});
router.route('/:id/favorites/:index')
	.all(function(req, res, next) {
		var id = req.params.id;
		var index = req.params.index;
		if(! ValidatorHelper.isMongoId(id)) {
			res.status(400).json({success: false, message: "ID incorrect."});
		} else if(req.decoded._id != id) {
			res.status(403).json({success: false, message: "Vous n'êtes pas autorisé à accéder à cette partie."});
		} else {
			
			Parent.findById(id, function (err, parent){
				if(err) 
					throw err;
				else if(! parent)
					res.status(404).json({success: false, message: "Aucun parent trouvé."});
				else if(! parent.favorites[index])
					res.status(404).json({success: false, message: "Aucun favori trouvé."});
				else 
					next();
			});
		}
	})
	.delete(function(req, res) {
		var id = req.params.id;
		var index = req.params.index;
		
		Parent.findById(id, function (err, parent){
			if(err) 
				throw err;
			else {
				parent.favorites.splice(index, 1);
				parent.save(function(err) {
					if (err)
						throw err;
					else
						res.status(200).json({success: true, message: "Favori supprimé."});
				});
			}
		});
	});

module.exports = router;
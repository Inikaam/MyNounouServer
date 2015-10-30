var express = require('express');
var router = express.Router();

var ValidatorHelper = require('../helpers/Validator');
var Chat = require('../models/Chat');

router.route('/')
	.get(function(req, res) {
		if(! req.query.nanny && ! req.query.parent) {
			res.status(400).json({success: false, message: "Un identifiant de nounou ou de parent doit être donné."});
		} else if((req.query.nanny && ! ValidatorHelper.isMongoId(req.query.nanny)) || 
				(req.query.parent && ! ValidatorHelper.isMongoId(req.query.parent))) {
			res.status(400).json({success: false, message: "Identifiant de nounou ou de parent incorrect."});
		} else {
			
			if((req.decoded.dispos && req.query.nanny && req.decoded._id != req.query.nanny) || 
			   (! req.decoded.dispos && req.query.parent && req.decoded._id != req.query.parent)) {
				res.status(403).json({success: false, message: "Vous n'êtes pas autorisés à consulter ces conversations."});
			} else {
				var filter = {};
				if(req.query.nanny)
					filter['id_nanny'] = req.query.nanny;
				if(req.query.parent)
					filter['id_parent'] = req.query.parent;
				Chat.find(filter, function(err, chats) {
					if(err)
						throw err;
					else
						res.status(200).json({success: true, message: "Conversations obtenues", data: chats});
				});
			}
		}
	})
	.post(function(req, res) {
		var isValid = true;
		
		if((req.decoded.dispos && req.body.nanny && req.decoded._id != req.body.nanny) || 
			   (! req.decoded.dispos && req.body.parent && req.decoded._id != req.body.parent)) {
			res.status(403).json({success: false, message: "Vous n'êtes pas autorisés à créer cette conversation."});
		} else {
			var newChat = new Chat(req.body);
			newChat.save(function(err){
				if (err) {
					throw err;
				}
				else {
					res.status(201).json({success: true, message: "Nouvelle conversation créée.", data: newChat});
				}
			});
		}

	});

router.route('/:id')
	.all(function(req, res, next) {
		id = req.params.id;
		if(! ValidatorHelper.isMongoId(id)) {
			res.jsonStatus(400);
		} else {
			Chat.findById(id, function (err, chat) {
				if(err)
					throw err;
				else if((req.decoded.dispos && chat.id_nanny != req.decoded._id) || 
						(! req.decoded.dispos && chat.id_parent != req.decoded._id)){
					res.status(403).json({success: false, message: "Vous n'êtes pas autorisés à accéder à cette conversation."})
				} else {
					next();
				}
			});
		}
	})
	.get(function(req, res) {
		id = req.params.id;
		
		Chat.findById(id, function (err, chat){
			if (err)
				throw err;
			else 
				res.status(200).json({success: true, message: "Conversation obtenue.", data: chat});
		});
	})
	.delete(function(req, res) {
		id = req.params.id;
		
		Chat.remove({_id: id}, function(err){
			if(err)
				res.json('Error')
			else
				res.jsonStatus(200);
		});
	});

router.route('/:id/messages')
	.all(function(req, res, next) {
		id = req.params.id;
		if(! ValidatorHelper.isMongoId(id)) {
			res.jsonStatus(400);
		} else {
			Chat.findById(id, function (err, chat) {
				if(err)
					throw err;
				else if((req.decoded.dispos && chat.id_nanny != req.decoded._id) || 
						(! req.decoded.dispos && chat.id_parent != req.decoded._id)){
					res.status(403).json({success: false, message: "Vous n'êtes pas autorisés à accéder à cette conversation."})
				} else {
					next();
				}
			});
		}
	})
	.get(function(req, res) {
		id = req.params.id;
		
		Chat.findById(id, function (err, chat){
			if (err)
				throw err;
			else 
				res.status(200).json({success: true, message: "Messages obtenus.", data: chat.messages});
		});
	})
	.post(function(req, res) {
		id = req.params.id;
		
		Chat.findByIdAndUpdate(id, {$push: {messages: req.body}}, function(err, chat){
			if (err)
				throw err;
			else {
				Chat.findById(id, {messages: 1}, function(err, chat) {
					if (err)
						throw err;
					else
						res.status(200).json({success: true, message: "Message ajouté", data: chat.messages});
				});
			}
		});
	});

module.exports = router;
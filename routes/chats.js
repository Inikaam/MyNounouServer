var express = require('express');
var router = express.Router();

var ValidatorHelper = require('../helpers/Validator');
var Chat = require('../models/Chat');

router.route('/')
	.get(function(req, res) {
		if(! req.query.nanny && ! req.query.parent) {
			res.status(400).send("Un identifiant de nounou ou de parent doit être donné.");
		} else if((req.query.nanny && ! ValidatorHelper.isMongoId(req.query.nanny)) || 
				(req.query.parent && ! ValidatorHelper.isMongoId(req.query.parent))) {
			res.status(400).send("Identifiant de nounou ou de parent incorrect.");
		} else {
			var filter = {};
			if(req.query.nanny)
				filter['id_nanny'] = req.query.nanny;
			if(req.query.parent)
				filter['id_parent'] = req.query.parent;
			Chat.find(filter, function(err, chats) {
				if(err)
					res.status(500).send(err);
				else
					res.status(200).json(chats);
			});
		}
	})
	.post(function(req, res) {
		var isValid = true;
	
		for (var index in req.body) {
			isValid &= (req.body[index] != "" && req.body[index] != null);
		}
	
		if (isValid) {
			var newChat = new Chat(req.body);
			newChat.save(function(err){
				if (err) {
					var errors = {};
					for(var i in err.errors) {
						errors[i] = err.errors[i].message;
					}
					res.status(400).send(errors);
				}
				else {
					res.status(201).json(newChat);
				}
			});
		} else {
			res.status(400).send('Champs invalides !');
		}
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
		
		Chat.findById(id, function (err, chat){
			if (err)
				res.status(500).send('Error');
			else if(!chat)
				res.status(404).send("Aucun message trouvé.")
			else 
				res.status(200).json(chat);
		});
	})
	.put(function(req, res) {
		id = req.params.id;
		console.info(id);
		Chat.findByIdAndUpdate(id, {$set: req.body}, function(err, chat){
			if(err)
				res.send('Error');
			else {
				if(! chat)
					res.status(404).send("Aucun message trouvé.");
				else {
					res.sendStatus(200);
				}
			}
		});
	})
	.delete(function(req, res) {
		id = req.params.id;
		
		Chat.remove({_id: id}, function(err){
			if(err)
				res.send('Error')
			else
				res.sendStatus(200);
		});
	});

module.exports = router;
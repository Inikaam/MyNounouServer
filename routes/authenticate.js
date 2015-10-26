var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var config = require('../security/config');

var Nanny = require('../models/Nanny');
var Parent = require('../models/Parent');

router.route('/nannies')
	.post(function(req, res) {

		var newNanny = new Nanny(req.body);
		newNanny.save(function(err){
			if (err) {
				var errors = {};
				for(var i in err.errors) {
					errors[i] = err.errors[i].message;
				}
				res.status(400).json({success: false, errors: errors});
			}
			else {
				res.status(201).json({success: true, message: 'Compte ' + newNanny.email + ' créé avec succès.'});
			}
		});
	});

router.route('/parents')
	.post(function(req, res) {
	
		var newParent = new Parent(req.body);
		newParent.save(function(err){
			if (err) {
				var errors = {};
				for(var i in err.errors) {
					errors[i] = err.errors[i].message;
				}
				res.status(400).json({success: false, errors: errors});
			}
			else {
				res.status(201).json({success: true, message: 'Compte ' + newParent.email + ' créé avec succès.'});
			}
		});
	});

router.route('/login-nanny')
	.post(function(req, res) {
		Nanny.findOne(
			{email: req.body.email, password: req.body.password}, 
			{password: 0}, 
			function(err, nanny) {
				if (err) throw err;
				
				if(! nanny) {
					res.json({ success: false, message: 'Authentification échouée. Email ou mot de passe incorrect.' });
				} else {
					var token = jwt.sign(nanny, config.secret, {expiresIn: 86400});
					
					res.json({
				        success: true,
				        message: 'Authentification réussie, bienvenue ' + nanny.firstname + ' ' + nanny.lastname,
				        token: token
			        });
				}
			});
	});

router.route('/login-parent')
	.post(function(req, res) {
		Parent.findOne(
			{email: req.body.email, password: req.body.password}, 
			{password: 0}, 
			function(err, parent) {
				if (err) throw err;
				
				if(! parent) {
					res.json({ success: false, message: 'Authentification échouée. Email ou mot de passe incorrect.' });
				} else {
					var token = jwt.sign(parent, config.secret, {expiresIn: 86400});
					
					res.json({
				        success: true,
				        message: 'Authentification réussie, bienvenue ' + parent.firstname + ' ' + parent.lastname,
				        token: token
			        });
				}
			});
	});



router.use(function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (token) {
		jwt.verify(token, config.secret, function(err, decoded) {
			if (err) {
				return res.json({
					success : false,
					message : 'Authentification du token échouée.'
				});
			} else {
				req.decoded = decoded;
				next();
			}
		});

	} else {
		return res.status(403).send({
			success : false,
			message : 'Aucun token fourni.'
		});

	}
});

module.exports = router;
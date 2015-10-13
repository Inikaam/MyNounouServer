var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({
	extended : false
});
var Nanny = require('../models/Nanny');

router.route('/')
	.get(function(req, res) {
		Nanny.find(function(err, nannies) {
			res.json(nannies);
		});
	})
	.post(parseUrlencoded, function(req, res) {
		var isValid = true;
	
		for (var index in req.body) {
			isValid &= (req.body[index] != "" && req.body[index] != null);
		}
	
		if (isValid) {
			var newNanny = new Nanny(req.body);
			newNanny.save(function(err){
				if (err) {
					var errors = {};
					for(var i in err.errors) {
						errors[i] = err.errors[i].message;
					}
					res.send(errors);
				}
				else {
					res.json(newNanny);
				}
			});
		} else {
			res.send('Champs invalides !');
		}
	});

router.route('/:id')
	.get(function(req, res) {
		id = req.params.id;
		
		if(/[0-9a-f]{24}/i.test(id)) {
			Nanny.findById(id, function (err, nanny){
				if (err)
					res.send('Error');
				else if(!nanny)
					res.status(404).send("Aucune nounou trouvée.")
				else 
					res.json(nanny);
			});
		} else {
			res.sendStatus(400);
		}
	})

// var nannyExample = new Nanny({
// name: 'Myriam'
// });
//
// nannyExample.save();
//
// Nanny.find(function(err, nannies){
// console.info(nannies);
// });

module.exports = router;
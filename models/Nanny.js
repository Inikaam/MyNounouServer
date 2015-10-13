var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Validator = require('../helpers/Validator');

var nannySchema = new Schema({
	email: {
		type: String,
		validate: {
			validator: Validator.isEmail,
			message: "{VALUE} n'est pas un email valide."
		}
	},
	date_add: Date,
	date_upd: {
		type: Date,
		default: Date.now
	},
	firstname: String,
	lastname: String,
	password: String,
	age: Number,
	gender: {
		type: String,
		validate: {
			validator: function(val) {
				return /H|F/i.test(val);
			},
			message: "{VALUE} n'est pas un genre valide."
		}
	},
	type: {
		type: String,
		validate: {
			validator: function(val) {
				return /nanny|babysitter/i.test(val);
			},
			message: "{VALUE} n'est pas un type valide."
		}
	},
	tel: {
		type: String,
		validate: {
			validator: Validator.isPhone,
			message: "{VALUE} n'est pas un numéro de téléphone valide."
		},
	},
	pic: {
		type: String,
		validate: {
			validator: Validator.isUrlImage,
			message: "{VALUE} n'est pas une image valide."
		}
	},
	video: {
		type: String,
		validate: {
			validator: Validator.isUrlVideo,
			message: "{VALUE} n'est pas une vidéo valide."
		}
	},
	price: Number,
	comments: [
        {
        	id_parent: String,
        	date: Date,
        	note: {
        		type: Number,
        		min: 0,
        		max: 5
        	},
        	text: String
        }
    ]
});

var Nanny = mongoose.model('Nanny', nannySchema);

module.exports = Nanny;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Validator = require('../helpers/Validator');

var parentSchema = new Schema({
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
	favorites: [String]
});

var Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;
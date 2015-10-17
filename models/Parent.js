var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ValidatorHelper = require('../helpers/Validator');

var parentSchema = new Schema({
	email: {
		type: String,
		required: true,
		validate: {
			validator: ValidatorHelper.isEmail,
			message: "{VALUE} n'est pas un email valide."
		}
	},
	date_add: {
		type: Date,
		default: Date.now
	},
	date_upd: {
		type: Date,
		default: Date.now
	},
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	gender: {
		type: String,
		required: true,
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
			validator: ValidatorHelper.isUrlImage,
			message: "{VALUE} n'est pas une image valide."
		}
	},
	video: {
		type: String,
		validate: {
			validator: ValidatorHelper.isUrlVideo,
			message: "{VALUE} n'est pas une vidéo valide."
		}
	},
	favorites: [String]
});

var Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;
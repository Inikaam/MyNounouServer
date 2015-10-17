var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ValidatorHelper = require('../helpers/Validator');

var chatSchema = new Schema({
	id_nanny: {
		type: String,
		required: true,
		validate: {
			validator: ValidatorHelper.isMongoId,
			message: "{VALUE} n'est pas un ID valide."
		}
	},
	id_parent: {
		type: String,
		required: true,
		validate: {
			validator: ValidatorHelper.isMongoId,
			message: "{VALUE} n'est pas un ID valide."
		}
	},
	messages: [
	    {
	    	date: {
	    		type: Date,
	    		default: Date.now
	    	},
	    	message: String
	    }
	]
});

var Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
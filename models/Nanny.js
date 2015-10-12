var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nannySchema = new Schema({
	email: String,
	firstname: String,
	lastname: String,
	password: String,
	gender: String,
	type: String,
	tel: {
		type: String,
		validate: {
			validator: function(val) {
				return /[0-9]{10}/.test(val);
			},
			message: "{VALUE} n'est pas un numéro de téléphone valide."
		},
	}
});

var Nanny = mongoose.model('Nanny', nannySchema);

module.exports = Nanny;
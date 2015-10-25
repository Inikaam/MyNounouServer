var ValidatorHelper = {
	isPhone: function(val) {
		return /^[0-9]{10}$/.test(val);
	},
	isEmail: function(val) { // Source : http://emailregex.com/
		return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(val);
	},
	// TODO : mettre les bons formats image
	isUrlImage: function(val) {
		return /(https?:\/\/.*\.(?:png|jpg))/i.test(val);
	},
	// TODO : mettre les bons formats de vidéo
	isUrlVideo: function(val) {
		return /(https?:\/\/.*\.(?:mp4|avi))/i.test(val);
	},
	isFrenchTime: function(val) {
		return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(val);
	},
	isMongoId: function(val) {
		return /^[0-9a-f]{24}$/.test(val);
	}
}

module.exports = ValidatorHelper;

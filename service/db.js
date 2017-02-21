var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/phoetry')

var Schema = mongoose.Schema

var ImageReference = mongoose.model('ImageReference', 
	{ 
		phrase: String, 
		date: { 
			type: Date, 
			default: Date.now 
		} 
	})

var Animation = mongoose.model('Animation', 
	{ 
		images: [], 
		completePhrase: String,
		date: { 
			type: Date, 
			default: Date.now 
		} 
	})


module.exports = {
	saveImage : function (phrase, callback) {
		var newImage = new ImageReference({phrase: phrase});
		newImage.save(function (err) {
			if(!err) {
				callback(newImage);
			} else {
				callback(false);
			}
		});
	},
	saveAnimation: function (phrase, images, callback) {
		var newAnimation = new Animation({
			completePhrase: phrase,
			images: images
		});

		newAnimation.save(function (err) {
			if(!err) {
				callback(newAnimation);
			} else {
				callback(false);
			}
		});
	},
	getAnimations: function (callback) {
		Animation.find({}).limit(10).sort({date: -1}).exec(function (err, results) {
			callback(results);
		});
	},
	getAnimation: function (id, callback) {
		Animation.findById(id, function (err, animation) {
			callback(animation);
		});
	}
}
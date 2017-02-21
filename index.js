var express = require('express')
var pug = require('pug')
var bodyParser = require('body-parser')
var videoshow = require('videoshow')
var gify = require('gify')
var request = require('request').defaults({encoding: null})
var sharp = require('sharp')

var app = express()

var db = require('./service/db');


app.set('view engine', 'pug')

app.use('/public', express.static(__dirname + '/public'));
app.use('/assets', express.static(__dirname + '/assets'));

//app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb'
}))
app.use(bodyParser.json({
  limit: '50mb'
}))


var buildSlides = function (slides, callback) {
	slidesLoop(slides, 0, function (updatedSlides) {
		callback(updatedSlides);
	});
}


var slidesLoop = function (slides, index, callback) {
	getImageFromGoogle(slides[index], function (imageFromGoogle) {
		storeAndResize(imageFromGoogle, slides[index], function (storedImage) {
			slides[index] = storedImage;
			index++;
			if(index >= slides.length) {
				callback(slides);
			} else {
				slidesLoop(slides, index, callback);
			}
		});
	});
}


var getImageFromGoogle = function (phrase, callback) {
	//&imgSize=small
	//AIzaSyAFuclPbqAFGzewBJ9mz0Thj0SYivMa1FQ
	//AIzaSyD36RMnqATmv6aXJOsasDgCnMlr0ccfEX8
	//AIzaSyCpZz6sEkmN3iLnUe_JwKi5eRvBqtvz6cg
	var searchString = "https://www.googleapis.com/customsearch/" + 
					   "v1?key=AIzaSyCpZz6sEkmN3iLnUe_JwKi5eRvBqtvz6cg" + 
					   "&cx=002286631027860291269:bp4qyaqb3eo&q=" + phrase + 
					   "&searchType=image&alt=json&num=10&start=1";
	request(searchString, function (error, response, body) {
		var body = JSON.parse(body);
	    callback(body.items[0].image.thumbnailLink);
	});
}



var storeAndResize = function (imageUrl, phrase, callback) {
	db.saveImage(phrase, function (newImage) {
		var imageName = newImage._id;
		request(imageUrl, function (err, response, body) {
			if(err) {
				console.log('image error', err);
			}
			sharp(body)
				.resize(100,100)
				.toFile('public/images/100x100/' + imageName + '.jpg', function (err) {
					if(err) {
						console.log('err', err);
					}
					callback(newImage);
				});
		})
	});
	
}

var buildAnim = function (phrase, slides, callback) {
	var slideImages = [];
	slides.forEach(function (slide, index) {
		slideImages[index] = 'public/images/100x100/' + slide._id + '.jpg';
	});

	slideImages.unshift(slideImages[0]);

	db.saveAnimation(phrase, slideImages, function (newAnim) {
		var videoOptions = {
		  fps: 3,
		  loop: 1, // seconds
		  transition: false,
		  transitionDuration: 0, // seconds
		  videoBitrate: 400,
		  videoCodec: 'libx264',
		  size: '200x200',
		  audioBitrate: '0k',
		  audioChannels: 0,
		  format: 'mp4',
		  pixelFormat: 'yuv420p'
		}

		videoshow(slideImages, videoOptions)
		  .save('public/videos/' +  newAnim._id + '.mp4')
		  .on('start', function (command) {
		    console.log('ffmpeg process started:', command)
		  })
		  .on('error', function (err, stdout, stderr) {
		    console.error('Error:', err)
		    console.error('ffmpeg stderr:', stderr)
		  })
		  .on('end', function (output) {
		    console.error('Video created in:', output);
		    gify('public/videos/' +  newAnim._id + '.mp4', 'public/gifs/' +  newAnim._id + '.gif', {width: 100, height: 100}, function(err){
		    	console.log('gif done');
			  	callback(newAnim);
			});
		    
		  })
	});
}

app.get('/api/get/animations', function (req,res) {
	db.getAnimations(function (animations) {
		animations.forEach(function (animation, index) {
			var anim = {};
			anim.id = animation._id;
			anim.videoUrl = 'public/videos/' +  animation._id + '.mp4';
			anim.gifUrl = 'public/gifs/' +  animation._id + '.gif';
			anim.date = animation.date;
			anim.images = animation.images;
			anim.completePhrase = animation.completePhrase;
			
			animations[index] = anim;

		});
		res.json(animations);
	});	
});

app.get('/api/get/animation/:id', function (req, res) {
	db.getAnimation(req.params.id, function (animation) {
		res.json({
			id : animation._id,
			videoUrl : 'public/videos/' +  animation._id + '.mp4',
			gifUrl : 'public/gifs/' +  animation._id + '.gif',
			date : animation.date,
			images : animation.images,
			completePhrase : animation.completePhrase
		});
	});
});

app.post('/api/post/animation', function (req, res) {
	var phrase = req.body.phrase;
	buildSlides(phrase.split(" "), function (slides) {
		buildAnim(phrase, slides, function (animation) {
			res.json(animation);	
		});
	});

});

app.get('/*', function (req, res) {
	res.render(
        'index',
        { title: 'Hey Hey Hey!', message: 'Yo Yo'}
	)
});

app.listen(4433, function () {
  console.log('Example app listening on port 3000!')
});


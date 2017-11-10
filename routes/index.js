var express = require('express');
var router = express.Router();

// Importing the user model
var User = require('../models/user');
var Book = require('../models/books');


/* GET home page. */
router.get('/', function (req, res, next) {
	// res.render('index', { title: 'Express' });


	//TODO get all variables to send to index
	if (req.session.username) {
		var otherbooks, userbooks;
		console.log("Inside");
		Book.getOtherBooks(req.session.username, (err, books) => {
			if (err) throw err;
			otherbooks = JSON.stringify(books, undefined, 3);
			console.log(otherbooks);

			Book.getMyBooks(req.session.username, (err, books) => {
				if (err) throw err;
				userbooks = JSON.stringify(books, undefined, 3);

				User.getUserByUsername(req.session.username, (err, user) => {
					if (err) throw err;
					res.render('index.hbs', {
						message: req.query.success,
						name: user.name,
						email: user.username,
						city: user.city,
						state: user.state,
						reqbooks: JSON.stringify(user.requestedBooks, undefined, 3),
						allbooks: otherbooks,
						mybooks: userbooks
					});

				});


			});
		});

	} else {
		res.redirect('/login-register');
	}
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login-register');
	}
}

router.get('/login-register', (req, res, next) => {
	res.render('login-register.hbs')
});

module.exports = router;

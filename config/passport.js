const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User.js')
const Image = require("../models/Image.js")

passport.serializeUser((user, done) => {
	done(null, user.id)
})

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user)
	})
})

// LOCAL SIGNUP
passport.use('local-signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, (req, email, password, done) => {
	User.findOne({email: email}, (err, user) => {
		if(err) return done(err)
		if(user) return done(null, false, req.flash('signupMessage', 'Email already exists. Did you mean to login?'))
		if(!req.body.name || !req.body.password) return done(null, false, req.flash("signUpMessage", "All fields are required"))
		var newUser = new User(req.body)
		newUser.save((err) => {
			if(err) throw err
			return done(null, newUser, null)
		})
	})
})) 

// LOCAL SIGNIN
passport.use('local-login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, (req, email, password, done) => {
	User.findOne({email: email}, (err, user) => {
		if(err) return done(err)
		if(!user) return done(null, false, req.flash('loginMessage', 'No user found. Maybe you meant to sign up?'))
		if(!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Invalid username or password.'))
		return done(null, user)
	})
}))

module.exports = passport
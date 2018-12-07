const LocalStrategy   = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function(passport) {
    // luu 1 user vao ben trong session.( luu user_id)
	passport.serializeUser(function(user, done) {
		 done(null, user._id);
	 });
	
	 
	 // tu thong tin da luu vao trong user. se tim va gan cai gi vao req.user: ==> de su dung ve sau nay.
	 passport.deserializeUser(function(_id, done) {
		 User.findById(_id, function(err, user) {
			 done(err, user);
			 console.log(user);
		 });
	 });
	
	 // kich ban xac thuc cua passport: login with passport
	passport.use('local-login', new LocalStrategy({
		 // by default, local strategy uses username and password, we will override with email
		 usernameField : 'user_login_email',
		 passwordField : 'user_login_pass',
		 passReqToCallback : true // allows us to pass back the entire request to the callback
	 },
	 function(req, email, password, done) { // callback with email and password from our form
 
		 // find a user whose email is the same as the forms email
		 // we are checking to see if the user trying to login already exists
		 User.findOne({email :  email }, function(err, user) {
			 // if there are any errors, return the error before anything else
			 if (err)
				 return done(err);
			 // if no user is found, return the message
			 if (!user)
				 return done(null, false, req.flash('loginMessage', 'Không tìm thấy user')); // req.flash is the way to set flashdata using connect-flash
 
			 // if the user is found but the password is wrong
			 if (user.password != password)
				 return done(null, false, req.flash('loginMessage', 'Email hoặc mật khẩu không hợp lệ')); // create the loginMessage and save it to session as flashdata
 
			 // all is well, return successful user
			 return done(null, user);
		 });
 
	 }));
 

     // kich ban xac thuc khi dang ki.
	 passport.use('local-signup', new LocalStrategy({
		 usernameField : 'email',
		 passwordField : 'password',
		 passReqToCallback : true 
	 },
	 function(req, email, password, done) {
		 process.nextTick(function() {
		 User.findOne({ 'local.email' :  email }, function(err, user) {
			 if (err)
				 return done(err);
			 if (user) {
				 return done(null, false, req.flash('signupMessage', 'Email  đã tồn tại .'));
			 } else {
				 var newUser            = new User();
				 newUser.local.email    = email;
				 newUser.local.password = newUser.generateHash(password);
				 newUser.save(function(err) {
					 if (err)
						 throw err;
					 return done(null, newUser);
				 });
			 }
 
		 });    
 
		 });
 
	 }));
 };
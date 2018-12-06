
module.exports = function(app, passport){
	app.get('/', function(req, res) {
        res.render('login/login'); 
    });
    
   app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/homechat',
        failureRedirect : '/', 
        failureFlash : true
	}));

	/*GET homechatpasge */
	// phai dang nhap thanh cong moi dc chuyen sang trang nay.
	app.get('/homechat', isLoggedIn, function(req, res) {
        res.render('homechat/homechat')
    });
	
	// Hàm được sử dụng để kiểm tra đã login hay chưa
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	}
}
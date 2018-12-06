var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login/login', { message: ''});
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/homechat',
  failureRedirect : '/', 
  failureFlash : true
}));

/*GET homechatpasge */
// phai dang nhap thanh cong moi dc chuyen sang trang nay.
router.get('/homechat', isLoggedIn, function(req, res) {
  res.render('homechat/homechat')
});

	// Hàm được sử dụng để kiểm tra đã login hay chưa
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	}

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login/login');
});


/* GET home chat page  */
router.get('/homechat', (req, res) => {
  res.render('homechat/homechat');

});
module.exports = router;

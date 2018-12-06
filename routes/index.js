var express = require('express');
const fs = require('fs');
const Image = require('../models/image');
const User = require('../models/user');
const path = require('path');
var router = express.Router();
var multer  = require('multer');
const url = require('url');
const passport = require('passport');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()  + path.extname(file.originalname));
  }
});
 
const upload = multer({storage: storage}).single("image");

router.get('/', function(req, res) {
    res.render('login/login', {message: ''})
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
/*POST user to server */
router.post('/singup', (req, res) => {
    upload(req, res, function (err) {
        // need to check if the req.file is set.
        if(req.file == null || req.file == undefined || req.file == ""){
            //redirect to the same url            
            res.redirect("/");
            
        }else{
            // An error occurred when uploading
            if (err) {
                res.render('login/login', {message: "Lỗi khi upload ảnh, vui lòng thực hiện lại"});
            }else{
                if(req.file.size > 1*1024*1024 ){
                res.render('login/login', {message: 'Kích thước ảnh không được vượt quá 5M'});
            }else {
                console.log(req.file);
                let email = req.body.user_email;
                let username = req.body.user_username;
                let password = req.body.user_password;
                let user = new User ();
                user.username = username;
                user.email = email;
                user.password = user.generateHash(password);
                user.avatar  = req.file.filename;

               user.save((err, user) => {
                   if(err) {
                      res.render('login/login', {message: 'Địa chỉ email đã tồn tại. Xin vui lòng thử lại'});
                   } else {
                      res.render('login/login', {message: 'success'});
                   }
               })
            }
            
         }
        
        }
    }); 
});


// test get session 
router.get('/get-session', (req, res) => {
   res.send(req.user);
});

module.exports = router;

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
    // truy van trong session lay thong tin user neu user da dang ki.
    let user = (req.user == null || req.user == undefined || req.user == "") ? null : req.user;
    const loginMessage = {
        user: user,
        message: '',
        status:''
    }
    console.log(user);
    res.render('login/login', {loginMessage: loginMessage})
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
                const loginMessage = {
                    user: '',
                    message: 'Lỗi khi upload ảnh, vui lòng thực hiện lại',
                    status: 'false'
                }
                res.render('login/login', {loginMessage: loginMessage});
            }else{
                if(req.file.size > 1*1024*1024 ){
                    const loginMessage = {
                        user: '',
                        message: 'Kích thước ảnh không được vượt quá 5M',
                        status: 'false'
                    }
                res.render('login/login', {loginMessage: loginMessage});
            }else {
               
                let email = req.body.user_email;
                let username = req.body.user_username;
                let password = req.body.user_password;
                let user_singup = new User ();
                user_singup.username = username;
                user_singup.email = email;
                user_singup.password = password;
                user_singup.avatar  = req.file.filename;

               user_singup.save((err, user) => {
                   if(err) {
                    const loginMessage = {
                        user_singup: user_singup,
                        message: 'Địa chỉ email đã tồn tại. Xin vui lòng thử lại',
                        status: 'false'
                    }
                    res.render('login/login', {loginMessage: loginMessage});

                   } else {
                    const loginMessage = {
                        user_singup: '',
                        message: 'Đăng kí tài khoản thành công. Xin mời tiếp tục',
                        status: 'success'
                    }
                      res.render('login/login', {loginMessage: loginMessage});
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

var express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const assert = require('assert');
const Image = require('../models/image');
const User = require('../models/user');
const Message = require('../models/message');
const Author = require('../models/author');
const Story = require("../models/story");
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
    res.render('login/login', {loginMessage: loginMessage})
});

// post login va kiem tra authencation. khi thanh cong se luu vao trong session.
router.post('/login', (req, res) => {
   const email = req.body.user_login_email;
   const password = req.body.user_login_pass;
   if(email &&  password) {
       User.findOne({email: email, password: password}, (err, user) => {
            if (err || !user) {
                    
                const loginMessage = {
                    user: {email: email, password: password},
                    message : 'Địa chỉ email hoặc mật khẩu không đúng. Xin kiểm tra lại',
                    status: 'false'
                }
                res.render('login/login', {loginMessage: loginMessage});
            } else {
                user.state = 'on';
                user.save((err, result) => {
                    if(err) {
                        res.send('false');
                    } else {
                        const homechatInfo = {
                            user: user
                            
                        };
                        res.render('homechat/homechat', {homechatInfo: homechatInfo});
                    }
                });
            }
       })   
    }
});

/*GET homechatpasge */
// phai dang nhap thanh cong moi dc chuyen sang trang nay.


/*POST user to server */
router.post('/singup', (req, res) => {
    upload(req, res, function (err) {
        // need to check if the req.file is set.
        if(req.file == null || req.file == undefined || req.file == ""){
            //redirect to the same url            
            const loginMessage = {
                user: '',
                message: 'File ảnh không hợp lệ ảnh phải có định dạng jpg/png/jpeg',
                status: 'false'
            }
            res.render('login/login', {loginMessage: loginMessage});
            
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
            } else {
               
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
                    console.log(err);
                    res.render('login/login', {loginMessage: loginMessage});

                   } else {
                    const loginMessage = {
                        user: user,
                        message: 'Đăng kí tài khoản thành công. Xin mời tiếp tục',
                        status: 'success'
                    }
                     // luu id user vao trong session 

                      req.session.userId = user._id;
                      res.render('login/login', {loginMessage: loginMessage});
                   }
               })
            }
         }
        
        }
    }); 
});


// ROUTER GET logout
router.get('/logout', function (req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  });

//ROUTER POST upload file
router.post('/file', (req, res) => {
    upload(req, res, function (err) {
        if(req.file == null || req.file == undefined || req.file == ""){
            res.send('error')
        } else {
            if(err) {            
                res.send('error')
            } else {
                res.send(req.file.filename);
            }
        }
    });

});

// ROUTER GET profile
router.get('/profile', (req, res) => {
   res.render('profile/profile');
});


module.exports = router;

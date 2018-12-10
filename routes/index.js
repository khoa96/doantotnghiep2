var express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const assert = require('assert');
const Image = require('../models/image');
const User = require('../models/user');
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
        User.authenticate(email, password, function (error, user) {
            if (error || !user) {
                
                const loginMessage = {
                    user: {email: email, password: password},
                    message : 'Địa chỉ email hoặc mật khẩu không đúng. Xin kiểm tra lại',
                    status: 'false'
                }
                res.render('login/login', {loginMessage: loginMessage});
            } else { 
               
                req.session.userId = user._id; // luu user_id vao trong session .
                // cap nhat lai trang thai state = on
                user.state = 'on';
                user.save((err, result) => {
                    if(err) {
                        res.send('false');
                    } else {
                        return res.redirect('/homechat');
                    }
                });
            }
        });
   }
});

/*GET homechatpasge */
// phai dang nhap thanh cong moi dc chuyen sang trang nay.
router.get('/homechat', function(req, res) {
    // truoc khi vao homechat ==> phai dang nhap => kiem tra session.
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
           res.redirect('/');
        } else {
            // load toan bo cac user on line co trong bang user .
            User.find({state: 'on', _id: {$nin: user._id}}, (err, user_onlines) => {
                if(err) {
                    res.send(err);
                } else {
                    if(user_onlines.length > 0 ){
                        const homechatInfo = {
                            user: user,
                            user_onlines: user_onlines
                        };
                    
                        res.render('homechat/homechat', {homechatInfo: homechatInfo});
                    }
                }
            })
          
        }
      }
    });
});

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

// test get session 
router.get('/get-session', (req, res) => {
   res.send(req.session.userId);
});

// logout 
// GET for logout logout
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


//test relation in mongoose
router.get('/test1', (req, res) => {
   let author = new Author();
   author.name = 'nguyen hoang Hieu';
   author.age = 23;
   author.save((err, author) => {
       if(err) {
           res.send(err);
       } else {
           console.log('them tac gia thanh cong . xin moi them cac tac pham cua tac gia');
           let story1 = new Story({
               creator: author._id,
               title: 'Tat den'
           });
           let story2 = new Story({
            creator: author._id,
            title: 'Lang Vu Dai'
           });
        let story3 = new Story({
         creator: author._id,
         title: 'Ben Que'
        });
           Story.insertMany([story1, story2, story3], (err, stories) => {
               if(err) {
                   res.send(err);
               }else {
                   res.send(stories);
               }
           })
       }
   })
});


//  tim kiem cac bai viet myTSL.calculateLux( ch0, ch1 )
router.get('/abc', (req, res) => {
  Story.findById('5c0ce098fd695127102b7b46').populate('creator', 'name').exec(function(err, result){
    if(err) {
        res.send(err);
    } else {
        res.send(result);
    }
  }) 
});


router.get('/test3', (req, res) => {
   Story.find({creator: '5c0ce2967acc881f509ac452'}).populate('creator').exec((err, result) => {
    if(err) {
        res.send(err);
    } else {
        res.send(result);
    }
   })
   
});
  // Every String can be casted in ObjectId now

  // liet ke tat ca cac bai viet cua tac gia co id la "5c0ce2967acc881f509ac452"
  router.get('/test4', (req, res) => {
     Author.findById('5c0ce2967acc881f509ac452', (err, author) => {
         if(err) {
             res.send(err);
         } else {
             if(author == null || author == undefined) {
                 res.send('not find user');
             } else {
                 Story.find({creator: author._id}, (err, stories) => {
                     if(err) {
                         res.send(err)
                     } else {
                        if(stories.length > 0){
                            stories.forEach((story, index) => {
                                console.log(index + "-"+ story.title);
                            })
                        } else{
                            console.log('emplty')
                        }
                     }
                 });
             }
         }
     })
  });

//5c0ccda731048f2a9c9e12d1
module.exports = router;

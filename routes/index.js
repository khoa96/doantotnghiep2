var express = require('express');
const fs = require('fs');
const Image = require('../models/image');
const User = require('../models/user');
const path = require('path');
var router = express.Router();
var multer  = require('multer');
const url = require('url');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()  + path.extname(file.originalname));
  }
});
 
const upload = multer({storage: storage}).single("image");

router.get('/', (req, res) => {
    res.render('login/login', {message: ''});
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
                user.password = password;
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

module.exports = router;

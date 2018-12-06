var express = require('express');
const fs = require('fs');
const Image = require('../models/image');
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
    res.render('login/login');
});


router.get('/profile', (req, res) => {
    res.render('profile/profile');
});
router.get('/upload', (req, res) => {
    Image.find({}, (err, images) => {
        if(err) {
            res.send(err);
        } else {
           res.render('profile/profile', {images: images});
        }
    })
});

router.post('/test', (req, res) => {
    const email = req.body.user_email;
    const username = req.body.user_username;
    const password = req.body.user_password;
    upload(req, res, function (err) {
        // need to check if the req.file is set.
        if(req.file == null || req.file == undefined || req.file == ""){
            //redirect to the same url            
            res.redirect("/");
            
        }else{
            // An error occurred when uploading
            if (err) {
                console.log(err);
            }else{
                // Everything went fine
                //define what to do with the params
                //both the req.body and req.file(s) are accessble here
                console.log(req.file);
        
        
                //store the file name to mongodb    
                //we use the model to store the file.
                let image = new Image();
                image.image = req.file.filename;
        
                
        
                //save the image
                image.save(()=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.redirect('/upload');
                    }
                });

            }
    
        }

    }); 

  
});


/**GET homechat page */
router.get('/homechat', (req, res) => {
     res.render('homechat/homechat');
});
module.exports = router;

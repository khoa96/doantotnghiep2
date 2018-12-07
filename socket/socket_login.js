const User = require('../models/user')
const express =  require('express');
const router = express.Router();
module.exports = function(io) {

    io.on('connection', function(socket) { 
	  socket.on('client-send-user-to-server', (data) => {
       const email = data.email;
       const password = data.password;
       User.find({email: email, password: password}, (err, user) => {
           if(err) {
               console.log(err);
           } else if(!user) {
              console.log(err);
           } else {
               // gui danh sach cac user online v

           }
       })
      });
      
    });

    return router;
}
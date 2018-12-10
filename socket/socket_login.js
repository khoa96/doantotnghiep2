const User = require('../models/user')
const express =  require('express');
const router = express.Router();
module.exports = function(io) {

    io.on('connection', function(socket) { 
        // lang nghe su kien client send user login to server
	  socket.on('client-send-user-login-to-server', (data) => {
       const email = data.email;
       const password = data.password;
       User.findOne({email: email, password: password}, (err, user) => {
           if(err) {
               console.log(err);
           } else if(!user) {
              console.log(err);
           } else {
               // khi login thanh cong. gui user vua login thanh cong den tat cac cac client khac trong server. 
              socket.broadcast.emit('server-broadcast-user-online-to-client', user)
           }
       })
      });
      
    });

    return router;
}
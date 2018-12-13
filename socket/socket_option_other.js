const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('../models/user')
const Room = require('../models/room')
const express =  require('express');
const router = express.Router();
module.exports = function(io) {

    io.on('connection', function(socket) { 
        // lang nghe su kien ( cac option khac cua group , load user them , them user, user ra khoi nhom)

        // 1. su kien: load tat ca  nguoi dung cua group.
        socket.on('client-request-get-all-user-in-group-to-server', function(data){
          // data gui di la  groupId cua nhom chat.
          Room.findById(data).populate('members').exec((err, result) => {
              if(err) {
                  console.log(err)
              } else {
                  socket.emit('server-response-all-user-in-group-to-client', result);
              }
          })
        });

        // 2. them nguoi vao nhom
        // 2.1 : tim kiem user de them vao nhom.
        socket.on('client-send-username-add-to-group', (data) => {
           // tim kiem theo user.
           User.find({username: new RegExp(data.username, 'i'), _id: {$nin: data.userIds}}, function(err, users) {
            if(err) {
                console.log(err);
            } else {
              if(users.length > 0) {
                
                 socket.emit('server-send-user-add-to-group-to-client', users);
              }
            }
         });
        })

        // 2.2 : them new user vao trong group.
        socket.on('add-new-user-to-group', (data) => {
           Room.findByIdAndUpdate(data.group, {$set: {members: data.arrUserIds}}, (err, result) => {
               if(err) {
                   console.log(err)
               } else {
                   console.log(result)
               }
           })
             
        })
    });

    return router;
}
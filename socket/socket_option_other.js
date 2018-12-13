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
        socket.on('search-user-add-to-group', (data) => {
            Room.findById(data.groupId, (err, room) => {
                if(err) {
                    console.log(err)
                } else {
                    console.log('fdsfd');
                    User.find({username: new RegExp(data.username, 'i'), _id: {$nin: room.members}}, function(err, users) {
                        if(err) {
                            console.log(err);
                        } else {
                           if(users.length > 0) {
                               socket.emit('server-respone-search-user-to-client', users);
                           }
                        }
                     });
                }
            })
        })

	  
    });

    return router;
}
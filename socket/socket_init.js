const express =  require('express');
const mongoose = require('mongoose');
const User =  require('../models/user');
const Room = require('../models/room');
const Message = require('../models/message');
const ObjectId = mongoose.Types.ObjectId;
const router = express.Router();
module.exports = function(io, arrUser) {
   
    io.on('connection', function(socket) { 
        // lang nghe su kien client send user login to server
        socket.on('client-send-info-to-server',function(data){
            socket.id_send = data;
            var user = {
                socket_id : socket.id,
                id_send  : data
            }
            arrUser.push(user);
            
        });

        // 1.lang nghe su kien get toan  bo nhom ma user da tham gia.
        // client gui len: id_client.
        socket.on('client-requesr-get-all-group-to-server', (data) => {
            Room.find({members: {$in: data}}, (err, rooms) => {
                if(err) {
                    console.log(err);
                } else {

                       let arrLastMessage = [];
                    //    rooms.forEach(room => {
                    //        Message.find({group: room._id}).sort({time: -1}).limit(1).exec((err, message) => {
                    //            if(err) {
                    //                console.log(err)
                    //            } else {
                    //                arrLastMessage.push(message)
                    //            }
                    //        })
                    //    });
                    socket.emit('server-send-all-group-to-client', {rooms: rooms, arrLastMessage: arrLastMessage});
                    
                }
           })
        });

        // 2. get all user online.
        socket.on('client-request-get-all-user-online-to-server', (data) => {
            User.find({_id: {$nin: data}, state: 'on'}, (err, useronlines) => {
                if(err) {
                    console.log(err)
                } else {
                   if(useronlines.length > 0) {
                     socket.emit('server-respone-user-online-to-client', useronlines)
                   }
                }
            })
        })
        
        // khi huy 1 socket ==> xoa socket trong mang arrUser
        socket.on('disconnect',function(){
            console.log('disconnect')
            for(let i = 0; i < arrUser.length; i++) {
                if(arrUser[i].id_send == socket.id_send){
                    arrUser.splice(i,1);
                    break;
                }
            }
           
        });
    });

    return router;
}
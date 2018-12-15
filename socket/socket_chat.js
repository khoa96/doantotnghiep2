
const express =  require('express');
const Message = require('../models/message');
const Room = require('../models/room')
const router = express.Router();
module.exports = function(io) {

    io.on('connection', function(socket) { 
        // lang nghe su kien client yeu cau socket join vao 1 room.
        socket.on('create-room', (data) => {
            if (socket.room) {
                // leave previous room
                socket.leave(socket.room);
            }
            // join new room
            socket.join(data);
            socket.room = data;
        })

        // server lang nghe yeu cau load lai tin nhan tu phia client cua room chat.
        socket.on('client-request-get-group-message-history-to-server', (data) => {
           
            Message.find({group: data}).populate('creator').exec((err, result) => {
                if(err) {
                    console.log(err);
                } else {
                   if(result.length > 0) {
                      
                    socket.emit('server-send-group-message-history-to-client', result);
                   }
                }
            })
            
        })
       // server lang nghe su co tin nhan gui len
       socket.on('client-send-group-message-to-server', (data) => {
            let message = new Message({
                creator: data.idCreator,
                body: data.body, 
                time: data.time,
                group: data.group,
                type: data.type
            });
            message.save((err, result) => {
                if(err) {
                    console.log(err);
                } else {
                
                   io.sockets.in(socket.room).emit("server-broadcast-message-to-room",data);
                }  
            })
       })

       //client yeu cau mau sac cua group.
		socket.on('client-request-get-color-of-group', (data) => {
            Room.findById(data, (err, room) => {
                if(err) {
                    console.log(err);
                } else {
                
                    socket.emit('server-response-color-group-to-client', room)
                   
                }
            })
          })
    });

    return router;
}
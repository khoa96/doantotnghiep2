
const express =  require('express');
const Message = require('../models/message');
const dateFormat = require('dateformat');
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
            socket.join(data.group);
            socket.room = data.group;
        })

        // server lang nghe yeu cau load lai tin nhan tu phia client cua room chat.
        socket.on('client-request-get-group-message-history-to-server', (data) => {
            console.log(data);
            Message.find({group: data}, (err, messages) => {
                if(err) {
                    console.log(err);
                } else {
                    socket.emit('server-send-group-message-history-to-client', messages);
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
               type: 'text'
           });
           message.save((err, result) => {
               if(err) {
                   console.log(err);
               } else {
                 io.sockets.in(socket.room).emit("server-broadcast-message-to-room",data);
               }
           })
       })
    });

    return router;
}

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

        // lang nghe su kien get toan  bo nhom ma user da tham gia.
        // client gui len: id_client.
        socket.on('client-requesr-get-all-group-to-server', (data) => {
            Room.find({members: {$in: data}}, (err, rooms) => {
                if(err) {
                    console.log(err);
                } else {
                   if(rooms.length > 0 ) {
                        var promises = [];

                        for(var numb in req.body)
                        {
                            promises.push(checkValue(numb));
                        }
                        
                        Promise.all(promises)    
                        .then(function(data){ /* do stuff when success */ })
                        .catch(function(err){ /* error handling */ });
                        
                        function checkValue(numb){
                        return new Promise(function(resolve, reject){
                        
                        });
                    //    let arrLastMessage = [];
                    //    rooms.forEach(room => {
                    //        Message.find({group: room._id}).sort({time: -1}).limit(1).exec((err, last_messge) => {
                    //            if(err) {
                    //                console.log(err)
                    //            } else {
                    //                arrLastMessage.push(last_messge);
                    //            }
                    //        })
                    //    });
                       //console.log(rooms);
                     //  socket.emit('server-send-all-group-to-client', {rooms: rooms, arrLastMessage: arrLastMessage});
                   }
        
                }
            }) 
        })
        
        // khi huy 1 socket ==> xoa socket trong mang arrUser
        socket.on('disconnect',function(){
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
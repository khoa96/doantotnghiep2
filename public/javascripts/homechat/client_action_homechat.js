
var socket  = io();
//lắng nghe server trả về danh sách các user đang online

//===============FUNCTION=================
function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

function sendMessage(){
    var message_body = $("#comment").val();
    var id_recipient = $(".conversation .heading-avatar-icon-recipient").attr('id');
    var username_send = $(".side .side-one .heading .heading-username p").text();
    var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
    if (message_body != "") {
        var message = {
            id_send: id_send,
            id_recepient: id_recipient,
            username_send: username_send,
            avatar_send: $(".side .side-one .heading .heading-avatar .heading-avatar-icon img").attr('src'),
            time: formatDate(new Date()),
            message_body: message_body
        };
        // send message to serve
        socket.emit('client-send-private-message-to-server',message);
        $("#comment").val("");
        // display typing
        $(".list-message").find('.message-on-reply').hide();
    }
}

function sendMessageInGroup (){
    var message_body = $("#comment").val();
    var id_recipient_group = $(".conversation .heading-avatar-icon-recipient").data("group-id"); // id của group
    var username_send = $(".side .side-one .heading .heading-username p").text();
    var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id'); // người  gui tin nhắn vào group
    if (message_body != "") {
        var message = {
            id_send: id_send,
            id_recepient_group: id_recipient_group,
            username_send: username_send,
            avatar_send: $(".side .side-one .heading .heading-avatar .heading-avatar-icon img").attr('src'),
            time: formatDate(new Date()),
            message_body: message_body
        };
        // send message to serve
        socket.emit('client-send-group-message-to-server',message);

        $("#comment").val("");
        $(".list-message").find('.message-on-reply').hide();
    }

}
function insertToMessageHistory(id_recipient,avatar_recipient,username_recipient) {
    var item = ' <div class="row sideBar-body" id="'+id_recipient+'"  >';
        item +=' <div class="col-sm-3 col-xs-3 sideBar-avatar"> ';
        item += ' <div class="avatar-icon">';
        item += ' <img src="'+avatar_recipient+'">';
        item += ' </div>';
        item += ' </div> ';
        item  += ' <div class="col-sm-9 col-xs-9 sideBar-main">';
        item += '  <div class="row"> ';
        item += ' <div class="col-sm-8 col-xs-8 sideBar-name">';
        item += '  <p class="name-meta" ><strong>'+username_recipient+'</strong></p>';
        item += '  <p class="message-history"></p>';
        item += ' </div>';
        item += ' <div class="col-sm-4 col-xs-4 pull-right sideBar-time"> ';
        item += '  <span class="time-meta pull-right"></span>';
        item += ' </div>';
        item += ' </div>';
        item += ' </div>';
        item += ' </div>';
    $(".list-message-history").prepend(item);
}
//=============NOTIFICATION=========================
function sendInfoClientToServer() {
    var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
    socket.emit('client-send-info-to-server',id_send);

}
function sendUserToServer(){
    var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
    socket.emit('client-send-user-login-to-server',id_send);

}
function sendNotificationToClient(){
    var id_recipient  = $(".conversation .heading .heading-avatar-icon-recipient").attr('id');
    var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
    var username_send = $(".side .side-one .heading .heading-username p").text();
    var avatar_send = $(".side .side-one .heading .heading-avatar img").attr('src');
    var time_send = formatDate(new Date());
    var notification = {
        id_send : id_send,
        username_send: username_send,
        avatar_send : avatar_send,
        id_recipient : id_recipient,
        time_send : time_send
    }
    socket.emit('client-send-notification-to-client',notification);
}


// ================== CHATG GROUP ==============================
function getIdUserIn(listUser,id_create_group) {
    var arrId = [];
    listUser.each(function (){
        arrId.push($(this).attr('id'));
    });
    arrId.push(id_create_group);
    arrId.sort();
    var group_id = 0;
    for(var i = 0; i < arrId.length; i++){
        group_id += arrId[i] + "";
    }
    return parseInt(group_id);
}
// hàm trả 1 mảng các id của user trong group
function getArrIdUserInGroup(listUser, id_create_group){
    var arrId = [];
    listUser.each(function (){
        arrId.push($(this).attr('id'));
    });
    arrId.push(id_create_group);
    arrId.sort();
    return arrId;
}
function getGroupName (listUser,username_create_group){
    var arrUsername = [];
    listUser.each(function (){
        arrUsername.push($(this).text());
    });
    arrUsername.push(username_create_group);
    arrUsername.sort();
    return arrUsername.toString();
}
function creatGroupChat (){
    var listUser = $(document).find('.box-search-user-group .right span');
    var id_create_group = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
    var username_create_group = $(".side .side-one .heading .heading-username p").text();

    if(listUser.length>1){

        var idUserInGroup = getIdUserIn(listUser,id_create_group);
        var groupName = getGroupName(listUser,username_create_group);
        var arrUserId = getArrIdUserInGroup(listUser,id_create_group);
        // emit to serve . insert to (group and user_group) in database
        socket.emit('create-group-chat',{groupName : groupName, arrUserId : arrUserId, idUserInGroup : idUserInGroup});

    }else if(listUser.length == 1){

         var username_recipient = listUser.text(); // tên người nhận
         var id_recipient = listUser.attr('id'); // id : người nhận
         var avatar_recipient = listUser.data('avatar'); // avatar người nhận

         var find = $(".list-message-history").find('#'+id_recipient);

        // join socket vào room
        var room_name = (id_recipient > id_create_group) ? (id_create_group +""+ id_recipient): (id_recipient +""+ id_create_group);
        socket.emit('creat-room',room_name);
        // nếu nhóm chat private đã tồn tại
         if(find.length == 1){

             // prepend to messagehistory
             $(".list-message-history").prepend(find);
             console.log("id-send = "+ id_create_group + " id_recipient = "+ id_recipient + " avatar-recipient = "+avatar_recipient);

             // load message history of private chat
             socket.emit('client-request-get-message-history-to-server',{id_send: id_create_group, id_recipient:id_recipient, avatar_recipient: avatar_recipient, username_recipient:username_recipient });
         }else{
             // insert to hisstory
             insertToMessageHistory(id_recipient,avatar_recipient,username_recipient);

         }
         // thay đổi heading của box chat private
        changeHeadingPrivateChat(id_recipient, username_recipient, avatar_recipient);

    }else{
        alert("Số thành viên của nhóm không hợp lệ");
    }
}

function changeHeadingPrivateChat (id_recipient, username_recipient, avatar){
    var heading =  ' <div class="col-sm-2 col-md-1 col-xs-3 heading-avatar"> ';
    heading += ' <div class="heading-avatar-icon heading-avatar-icon-recipient" id="'+id_recipient+'"> ';
    heading += ' <img src="'+avatar+'"> ';
    heading += ' </div> ';
    heading += ' </div> ';
    heading += ' <div class="col-sm-8 col-xs-7 heading-name"> ';
    heading += ' <a class="heading-name-meta">'+username_recipient+'</a> ';
    heading += ' <span class="heading-online">Online</span> ';
    heading += ' </div> ';
    heading += ' <div class="col-sm-1 col-xs-1  heading-dot pull-right" id="option-room-chat"> ';
    heading += ' <i class="fa fa-ellipsis-v fa-2x  pull-right" aria-hidden="true"></i> ';
    heading += ' </div> ';

    var body = ' <div class="row message-previous"> ';
    body += ' <div class="col-sm-12 previous"> ';
    body += ' <a href="#" id="btn-click-load-pre-message" >Show Previous Message!</a> ';
    body += ' </div> ';
    body += '</div>';
    body += ' <div class="row list-message"> ';
    body += ' </div> ';
    $(document).find('.conversation .heading').html(heading);
    $(document).find('.conversation #conversation').html(body);
}
function changeHeadingBoxGroupChat (groupId, groupName){
    var heading =  ' <div class="col-sm-2 col-md-1 col-xs-3 heading-avatar"> ';
    heading += ' <div class="heading-avatar-icon heading-avatar-icon-recipient" data-group-id="'+groupId+'"> ';
    heading += ' <img src="./images/group1.png"> ';
    heading += ' </div> ';
    heading += ' </div> ';
    heading += ' <div class="col-sm-8 col-xs-7 heading-name"> ';
    heading += ' <a class="heading-name-meta">'+groupName+'</a> ';
    heading += ' <span class="heading-online">Online</span> ';
    heading += ' </div> ';
    heading += ' <div class="col-sm-1 col-xs-1  heading-dot pull-right"  > ';
    heading += ' <i class="fa fa-ellipsis-v fa-2x  pull-right" id="option-group-chat" aria-hidden="true"></i> ';
    heading += ' <div class="box-option hidden-box-option-group"> ';
    heading += ' <div class="nav-side-menu"> ';
    heading += ' <div class="menu-list"> ';
    heading += ' <ul id="menu-content" class="menu-content collapse out"> ';
    heading += ' <li><a href="#"><i class="fa fa-cog fa-lg"></i>Cài Đặt Nhóm</a></li>';
    heading += ' <li  data-toggle="collapse" data-target="#heading" class="collapsed active"> ';
    heading += ' <a href="#"><i class="fa fa-gift fa-lg"></i> Tùy chọn <span class="arrow"></span></a> ';
    heading += ' </li> ';
    heading += ' <ul class="sub-menu collapse" id="heading"> ';
    heading += ' <li class="change-name-group">Đổi tên nhóm</li> ';
    heading += ' <li class="change-name-member">Chỉnh sửa biệt danh</li>';
    heading += ' <li class="click-change-color">Thay đổi màu sắc</li>';
    heading += ' <li class="click-out-group">Rời khỏi nhóm</li> ';
    heading += ' </ul> ';
    heading += ' <li data-toggle="collapse" data-target="#people" class="collapsed"> ';
    heading += ' <a href="#"><i class="fa fa-users fa-lg"></i> Người dùng <span class="arrow"></span></a> ';
    heading += ' </li> ';
    heading += ' <ul class="sub-menu collapse" id="people"> ';
    heading += ' <li > ';
    heading += ' <div class="row user-of-group click-add-user" > ';
    heading += ' <div class="col-sm-3 col-xs-3 user-chat-avatar">';
    heading += ' <div class="user-chat-avatar-icon"> ';
    heading += ' <img src="./images/addIcon.png"> ';
    heading += ' </div> ';
    heading += ' </div> ';
    heading += ' <div class="col-sm-9 col-xs-9 user-chat-main"> ';
    heading += ' <div class="row"> ';
    heading += ' <div class="col-sm-8 col-xs-8 user-chat-name"> ';
    heading += ' <span class="user-chat-name-meta">Thêm người</span> ';
    heading += ' </div> ';
    heading += ' </div> ';
    heading += ' </div> ';
    heading += ' </div> ';
    heading += ' </li> ';
    heading += ' <div class="list-user-in-group"></div>'
    heading += ' </ul> ';
    heading += ' </ul> ';
    heading += ' </div> ';
    heading += ' </div> ';
    heading += ' </div> ';
    heading += ' </div> ';

    var body = ' <div class="row message-previous" > ';
        body += ' <div class="col-sm-12 previous"> ';
        body += ' <a href="#" id="btn-click-load-pre-message">Show Previous Message!</a> ';
        body += ' </div> ';
        body += ' </div> ';
        body += ' <div class="row list-message"> ';
        body += ' </div> ';
    $(document).find('.conversation .heading').html(heading);
    $(document).find('.conversation #conversation').html(body);
}
function insertGroupChatToMessageHistory(groupId,groupName, idUserInGroup) {
    var group = ' <div class="row sideBar-body" data-group-id="'+groupId+'" data-name-room="'+idUserInGroup+'" >';
    group +=' <div class="col-sm-3 col-xs-3 sideBar-avatar"> ';
    group += ' <div class="avatar-icon">';
    group += ' <img src="./images/group1.png">';
    group += ' </div>';
    group += ' </div> ';
    group += ' <div class="col-sm-9 col-xs-9 sideBar-main">';
    group += '  <div class="row"> ';
    group += ' <div class="col-sm-8 col-xs-8 sideBar-name">';
    group += '  <p class="name-meta" ><strong>'+groupName+'</strong></p>';
    group += '  <p class="message-history"></p>';
    group += ' </div>';
    group += ' <div class="col-sm-4 col-xs-4 pull-right sideBar-time"> ';
    group+= '  <span class="time-meta pull-right"></span>';
    group += ' </div>';
    group += ' </div>';
    group += ' </div>';
    group += ' </div>';

    // //thêm  nhóm vào list-message-history
    $(".list-message-history").prepend(group);
    socket.emit('creat-room', idUserInGroup)
}

//========================LISTEN ACTION ============
socket.on ('server-broadcast-user-online-to-client',function (data) {
    // them user vua dang nhap vao list user online
    var user =  ' <div class="row user-chat-body" id="'+data.id+'"> ';
        user += ' <div class="col-sm-3 col-xs-3 user-chat-avatar"> ';
        user += ' <div class="user-chat-avatar-icon"> ';
        user += ' <img src="./'+ data.avatar +'"> ';
        user += ' </div> ';
        user += ' </div> ';
        user += ' <div class="col-sm-9 col-xs-9 user-chat-main"> ';
        user += ' <div class="row">';
        user += ' <div class="col-sm-8 col-xs-8 user-chat-name">';
        user += ' <span class="user-chat-name-meta">'+data.username+'</span> ';
        user += ' </div>';
        user += ' <div class="col-sm-4 col-xs-4 pull-right "> ';
        user += ' <span class="time-meta pull-right "><span class="user-state"></span></span> ';
        user += ' </div> ';
        user += ' </div> ';
        user += ' </div> ';
        user += ' </div> ';
        $(".list-user-online").append(user);
});
//lang nghe user logout
socket.on('server-broadcast-user-logout-to-client',function(data){
    $(".list-user-online").find("#"+data).hide('slow');
});
// lắng nghe sự kiên server trả về tin nhăn
socket.on('server-broadcast-message-to-room',function (data) {
    var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
    var id_recipient  = $(".conversation .heading .heading-avatar-icon-recipient").attr('id');
    if(data.id_send == id_send){
        // thêm tin nhắn vào phía người gui
        var message  = ' <div class="row message-body"> ';
            message += ' <div class="col-sm-12 message-main-sender"> ';
            message += ' <div class="sender"> ';
            message += ' <div class="message-text">'+data.message_body+' </div>';
            message += ' <span class="message-time pull-right">'+data.time+'</span> ';
            message += ' </div> ';
            message += ' </div> ';
            message += ' </div> ';
            $(".list-message").append(message);
            $(document).find(".list-message-history").find('#'+id_recipient).find(".message-history").html('<strong>Bạn:'+data.message_body+'</strong>');
            $(document).find(".list-message-history").find('#'+id_recipient).find(".time-meta").html('<strong>'+data.time+'</strong>');

            $("#conversation").animate({
              scrollTop : $('#conversation').get(0).scrollHeight
            });
    }else{
        // nếu tin nhắn ko phải của mình gui đi.
        var message = ' <div class="row message-body"> ';
            message += ' <div class="col-sm-12 message-main-receiver"> ';
            message += ' <div class="left" style="width: 10%;float: left;margin-top: 10px"> ';
            message += '  <img src="'+data.avatar_send+'" style="display: block;with:40px;height: 40px;border-radius: 50%;margin-top: 15px" data-toggle="tooltip" data-placement="left" title="'+data.username_recipient+'"> ';
            message += ' </div>';
            message += ' <div class="right" style="width: 90%;float: left;">';
            message += ' <div class="receiver">';
            message += ' <div class="message-text" >'+data.message_body+'</div> ';
            message += ' <span class="message-time pull-right">'+data.time+'</span>';
            message += ' </div> ';
            message += ' </div> ';
            message += ' </div> ';
            message += ' </div> ';
        $('.list-message').append(message);
        $(document).find(".list-message-history").find('#'+id_recipient).find(".message-history").html('<strong>'+data.message_body+'</strong>');
        $(document).find(".list-message-history").find('#'+id_recipient).find(".time-meta").html('<strong>'+data.time+'</strong>');

        $("#conversation").animate({
            scrollTop : $('#conversation').get(0).scrollHeight
        });
    }
});

// lắng nghe sự kiện server trả về người đang nhập tin nhắn
socket.on('server-broadcast-client-typing',function(data){
    var typing_message = ' <div class="row message-body message-on-reply">';
        typing_message += ' <div class="col-sm-12 message-main-receiver ">';
        typing_message += ' <div class="left" style="width: 10%;float: left;margin-top: 10px"> ';
        typing_message += '  <img src="'+data.user_typing_avatar+'" alt="" style="display: block;with:40px;height: 40px;border-radius: 50%;margin-top: 15px"> ';
        typing_message += ' </div> ';
        typing_message += ' <div class="right" style="width: 90%;float: left;"> ';
        typing_message += ' <div class="receiver">';
        typing_message += ' <div class="message-text"> ';
        typing_message += ' <div class="fb-chat--bubbles"> ';
        typing_message += ' <span></span> ';
        typing_message += ' <span></span> ';
        typing_message += ' <span></span> ';
        typing_message += '  </div>';
        typing_message += '  </div>';
        typing_message += '  </div>';
        typing_message += '  </div>';
        typing_message += '  </div>';
        typing_message += '  </div>';
       $(".list-message").append(typing_message);
       $("#conversation").animate({
        scrollTop : $('#conversation').get(0).scrollHeight
       });
});

//lắng nghe sự kiện trả về  message history
socket.on('server-send-message-history-to-client',function(data){
    var message_history = data.message_history;
    var avatar_recipient = data.avatar_recipient;
    var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
    for(var i = 0;i < message_history.length;i++){
        if(message_history[i].creator_id == id_send){
            var message  = ' <div class="row message-body"> ';
            message += ' <div class="col-sm-12 message-main-sender"> ';
            message += ' <div class="sender"> ';
            message += ' <div class="message-text">'+message_history[i].message_body+' </div>';
            message += ' <span class="message-time pull-right">'+message_history[i].create_date+'</span> ';
            message += ' </div> ';
            message += ' </div> ';
            message += ' </div> ';
            $('.list-message').append(message);

        }else{
            var message = ' <div class="row message-body"> ';
            message += ' <div class="col-sm-12 message-main-receiver"> ';
            message += ' <div class="left" style="width: 10%;float: left;margin-top: 10px"> ';
            message += '  <img src="'+avatar_recipient+'" style="display: block;with:40px;height: 40px;border-radius: 50%;margin-top: 15px" data-toggle="tooltip" data-placement="top" title="'+data.username_recipient+'"> ';
            message += ' </div>';
            message += ' <div class="right" style="width: 90%;float: left;">';
            message += ' <div class="receiver">';
            message += ' <div class="message-text" >'+message_history[i].message_body+'</div> ';
            message += ' <span class="message-time pull-right">'+message_history[i].create_date+'</span>';
            message += ' </div> ';
            message += ' </div> ';
            message += ' </div> ';
            message += ' </div> ';
            $('.list-message').append(message);
        }
    }
    $("#conversation").animate({
        scrollTop : $('#conversation').get(0).scrollHeight
    });
});

// lắng nghe sự kiện client focus out
socket.on('server-broadcast-client-not-typing',function(){
    $(".list-message").find('.message-on-reply').hide();
});

//lắng nghe thông báo của client khác khi có tin nhắn trả về từ phía server.
socket.on('server-send-notification-to-client',function(data){
   var count_notification = $(".notification-count").text();
   var id_recipient  = $(".conversation .heading .heading-avatar-icon-recipient").attr('id');
   // insert notification into list notification
    var notification = ' <div class="row sideBar-body" > ';
        notification += ' <div class="col-sm-2 col-xs-2 sideBar-avatar"> ';
        notification += '  <div class="avatar-icon"> ';
        notification += ' <img src="'+data.avatar_send+'"> ';
        notification += ' </div> ';
        notification += ' </div> ';
        notification += ' <div class="col-sm-10 col-xs-10 sideBar-main"> ';
        notification += '  <div class="row"> ';
        notification += '  <p class="name-meta" ><strong>'+data.username_send+'</strong> đã gửi tin nhắn cho bạn</p> ';
        notification += ' <p class="message-history time-notification" >'+data.time_send+'</p> ';
        notification += ' </div> ';
        notification += ' </div> ';
        notification += ' </div> ';
        notification += ' </div> ';

    if(id_recipient != data.id_send){
        if(count_notification == ""){
            $(".notification-count").text(1);
        }else{
            $(".notification-count").text(parseInt(count_notification)+1);
        }
        $(".list-notification").prepend(notification);
    }

});

//lắng nghe sự kiện server trả về kết quả tìm kiếm user theo tên
socket.on('server-send-search-result-by-name-to-client',function (data) {
     var search_result_user = $(document).find('.search-result-user-group');
         search_result_user.css('display','block');
         search_result_user.find(".list-user-result").html("");
    if(data.length > 0){
       for (var i = 0;i<data.length;i++){
              var user = '<div class="row sideBar-body user-search" id="'+data[i].id+'" > ';
              user += ' <div class="col-sm-2 col-xs-2 sideBar-avatar"> ';
              user += ' <div class="avatar-icon"> ';
              user += ' <img src="./'+data[i].avatar+'"> ';
              user += ' </div> ';
              user += ' </div> ';
              user += ' <div class="col-sm-10 col-xs-10 sideBar-main"> ';
              user += ' <div class="row"> ';
              user += '  <p class="name-meta" >'+data[i].username+'</p> ';
              user += '  </div> ';
              user += ' </div> ';
              user += ' </div> ';
              search_result_user.find('.list-user-result').append(user);
       }
    }else{
        search_result_user.css('display','none');
    }
});

// lắng nghe  khi serve trả về group
socket.on ('server-broadcast-group-chat-to-client',function (data){
    var groupName = data.groupName;
    var arrUserId = data.arrUserId;
    var groupId = data.groupId;
    var group = ' <div class="row sideBar-body" data-group-id="'+groupId+'" data-name-room="'+data.idUserInGroup+'">';
    group += ' <div class="col-sm-3 col-xs-3 sideBar-avatar"> ';
    group += ' <div class="avatar-icon">';
    group += ' <img src="./images/group1.png">';
    group += ' </div>';
    group += ' </div> ';
    group += ' <div class="col-sm-9 col-xs-9 sideBar-main">';
    group += ' <div class="row"> ';
    group += ' <div class="col-sm-8 col-xs-8 sideBar-name">';
    group += ' <p class="name-meta" ><strong>'+groupName+'</strong></p>';
    group += ' <p class="message-history"></p>';
    group += ' </div>';
    group += ' <div class="col-sm-4 col-xs-4 pull-right sideBar-time"> ';
    group += ' <span class="time-meta pull-right">11:23</span>';
    group += ' </div>';
    group += ' </div>';
    group += ' </div>';
    group += ' </div>';

    $(".list-message-history").prepend(group);

});

// lắng  nghe sự kiện khi create nhóm đã tồn tại
socket.on('server-response-group-chat-exists-to-client', function (data){

    var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');

    // insert group chat  to top
   var item =  $(document).find(".list-message-history").find(".sideBar-body[data-group-id='"+data.group_id+"']");
   $(".list-message-history").prepend(item);

   // change heading box chat
    changeHeadingBoxGroupChat(data.group_id, data.groupName);
    var group_id = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").data('group-id');

   // load group message history of group.
    socket.emit('client-request-get-group-message-history-to-server',{id_send:id_send, group_id : group_id});

});

socket.on('server-send-group-chat-to-client',function(data){
    changeHeadingBoxGroupChat(data.groupId,data.groupName);
    insertGroupChatToMessageHistory(data.groupId, data.groupName, data.idUserInGroup);
});

// lắng nghe server gui tin nhắn đến nhóm
socket.on('server-broadcast-message-to-all-client-in-group',function(data){
    var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
    var color = $(document).find(".sender").css('background-color');

    if(data.id_send == id_send){
        // thêm tin nhắn vào phía người gui
        var message  = ' <div class="row message-body"> ';
        message += ' <div class="col-sm-12 message-main-sender"> ';
        message += ' <div class="sender" style="background-color: '+color+'"> ';
        message += ' <div class="message-text">'+data.message_body+' </div>';
        message += ' <span class="message-time pull-right">'+data.time+'</span> ';
        message += ' </div> ';
        message += ' </div> ';
        message += ' </div> ';

        $(".list-message").append(message);
         $(document).find(".list-message-history").find(".sideBar-body[data-group-id='"+data.id_recepient_group+"']").find(".message-history").html('<strong>Bạn:'+data.message_body+'</strong>');
         $(document).find(".list-message-history").find(".sideBar-body[data-group-id='"+data.id_recepient_group+"']").find(".time-meta").html('<strong>'+data.time+'</strong>');

        $("#conversation").animate({
            scrollTop : $('#conversation').get(0).scrollHeight
        });
    }else{
        // nếu tin nhắn ko phải của mình gui đi.
        var message = ' <div class="row message-body"> ';
        message += ' <div class="col-sm-12 message-main-receiver"> ';
        message += ' <div class="left" style="width: 10%;float: left;margin-top: 10px" data_username="'+data.username_recipient+'"> ';
        message += '  <img src="'+data.avatar_send+'"  style="display: block;with:40px;height: 40px;border-radius: 50%;margin-top: 15px"> ';
        message += ' </div>';
        message += ' <div class="right" style="width: 90%;float: left;">';
        message += ' <div class="receiver">';
        message += ' <div class="message-text" >'+data.message_body+'</div> ';
        message += ' <span class="message-time pull-right">'+data.time+'</span>';
        message += ' <span class="name-member">'+data.username_send+'</span>';
        message += ' </div> ';
        message += ' </div> ';
        message += ' </div> ';
        message += ' </div> ';

        $('.list-message').append(message);
         $(document).find(".list-message-history").find(".sideBar-body[data-group-id='"+data.id_recepient_group+"']").find(".message-history").html('<strong>'+data.username_send+': </strong>'+'<strong>'+data.message_body+'</strong>');
         $(document).find(".list-message-history").find(".sideBar-body[data-group-id='"+data.id_recepient_group+"']").find(".time-meta").html('<strong>'+data.time+'</strong>');


        $("#conversation").animate({
            scrollTop : $('#conversation').get(0).scrollHeight
        });
    }
});

// lắng nghe server trả về tin nhắn cũ của nhóm ( LOAD MESSAGE HISTORY)
socket.on('server-send-group-message-history-to-client',function(data){
    // code load message history of group chat.
    var message_history = data.message_history;
    var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
    for(var i = 0;i < message_history.length;i++){
        var nickname = message_history[i].nickname;
        if(nickname == null ){
          nickname = message_history[i].username;
        }
        if(message_history[i].creator_id == id_send){
            // tin nhắn của chính user
            var message  = ' <div class="row message-body"> ';
            message += ' <div class="col-sm-12 message-main-sender"> ';
            message += ' <div class="sender"> ';
            message += ' <div class="message-text">'+message_history[i].message_body+' </div>';
            message += ' <span class="message-time pull-right">'+message_history[i].create_date+'</span> ';
            message += ' </div> ';
            message += ' </div> ';
            message += ' </div> ';
            $(".list-message").append(message);

        }else{
            // ko phải tin nhắn của user.
            var message = ' <div class="row message-body"> ';
            message += ' <div class="col-sm-12 message-main-receiver"> ';
            message += ' <div class="left" style="width: 10%;float: left;margin-top: 10px"> ';
            message += '  <img src="./'+message_history[i].avatar+'" style="display: block;with:40px;height: 40px;border-radius: 50%;margin-top: 15px" data-toggle="tooltip" data-placement="top" title="'+data.username_recipient+'"> ';
            message += ' </div>';
            message += ' <div class="right" style="width: 90%;float: left;">';
            message += ' <div class="receiver">';
            message += ' <div class="message-text" >'+message_history[i].message_body+'</div> ';
            message += ' <span class="message-time pull-right">'+message_history[i].create_date+'</span>';
            message += ' <span class="name-member">'+nickname+'</span>'
            message += ' </div> ';
            message += ' </div> ';
            message += ' </div> ';
            message += ' </div> ';
            $('.list-message').append(message);
        }
    }
    $("#conversation").animate({
        scrollTop : $('#conversation').get(0).scrollHeight
    });

});

// lắng nghe sự kiện tra về màu sắc
socket.on('server-broadcast-color-to-all-client-in-group', function(data){

    var group_notification = ' <div class="change-group-notification" style="text-align: center;height: 40px;margin-top: 10px;margin-bottom: 20px;"> ';
    group_notification += ' <p class="time-change">'+data.time_change+'</p> ';
    group_notification += ' <p class="content-notification"> ';
    group_notification += ' <span class="user-change"><strong>'+data.user_change+'</strong></span> ';
    group_notification += ' <span class="content">Đã thay đổi màu sắc của cuộc trò chuyện</span> ';
    group_notification += ' </p> ';
    group_notification += ' </div> ';
    $(document).find('.sender').css('background-color',data.color);
    $(".list-message").append(group_notification);
    $("#conversation").animate({
        scrollTop : $('#conversation').get(0).scrollHeight
    });
});

// sự kiện trả về option của group
socket.on('server-response-option-group-to-client', function(data){
    var color = data.color;
    $(".sender").css('background-color', color);
});

// lắng nghe sự kiện trả về all member of group trong ( thay đổi nickname)
socket.on('server-response-all-member-group-to-client', function(data){
    $("#modal-change-name-member").find(".list-member").html("");
    for(var i = 0; i < data.length; i++){
        var member = '  <div class="member" data-group-id="'+data[i].group_id+'" data-user-id="'+data[i].id+'"> ';
        member += ' <div class="avatar-member">';
        member += ' <img src="./'+ data[i].avatar+'"> ';
        member += ' </div> ';
        member += ' <div class="name-member" >';
        member += ' <span>'+data[i].username+'</span> ';
        member += ' </div> ';
        member += ' </div> ';

        $("#modal-change-name-member").find(".list-member").append(member);
    }
     $("#modal-change-name-member").modal('show').removeClass('zoomOut');

});

socket.on('server-broadcast-change-name-member-to-group', function(data){

    var username  = $(".side .side-one .heading .heading-username p").text();
    if(username == data.user_change){
        var group_notification = '  <div class="change-group-notification" style="text-align: center;height: 40px;margin-top: 10px;margin-bottom: 20px;"> ';
        group_notification += ' <p class="time-change">'+data.time_change+'</p> ';
        group_notification += ' <p class="content-notification"> ';
        group_notification += ' <span class="content">Bạn đã đặt biệt danh cho <strong>'+data.first_name+'</strong> là  <strong>'+data.nickname+'</strong></span> ';
        group_notification += ' </p> ';
        group_notification += ' </div> ';

    }else{
        var group_notification = '  <div class="change-group-notification" style="text-align: center;height: 40px;margin-top: 10px;"> ';
        group_notification += ' <p class="time-change">'+data.time_change+'</p> ';
        group_notification += ' <p class="content-notification"> ';
        group_notification += ' <span class="content"><strong>'+data.user_change+'</strong> đã đặt biệt danh cho <strong>'+data.first_name+'</strong> là  <strong>'+data.nickname+'</strong></span> ';
        group_notification += ' </p> ';
        group_notification += ' </div> ';
    }
    $(".list-message").append(group_notification);
    $("#conversation").animate({
        scrollTop : $('#conversation').get(0).scrollHeight
    });

});

// sự kiên thay đổi tên group
socket.on('server-broadcast-change-name-group-to-group', function(data){
    var group_notification = '  <div class="change-group-notification" style="text-align: center;margin-top: 10px;margin-bottom: 20px;height: 40px;"> ';
    group_notification += ' <p class="time-change">'+data.time_change+'</p> ';
    group_notification += ' <p class="content-notification"> ';
    group_notification += ' <span class="content"><strong>'+data.user_change+'</strong> đã thay đổi tên cuộc trò chuyện thành  <strong>'+data.name_group+'</strong> </span> ';
    group_notification += ' </p> ';
    group_notification += ' </div> ';

    // insert notification to list message
    $(".list-message").append(group_notification);
    $("#conversation").animate({
        scrollTop : $('#conversation').get(0).scrollHeight
    });

    // change heading box group-chat.
    $(document).find(".conversation .heading-name .heading-name-meta").text(data.name_group);

    // change list  heading group message history
    $(document).find(".list-message-history").find(".sideBar-body[data-group-id='"+data.group_id+"']").find(".sideBar-name .name-meta strong").text(data.name_group);


});

// add user in group
socket.on('server-response-all-user-in-group-to-client', function(data){
    $("#people .list-user-in-group").html("");
    for(var i = 0; i < data.length; i++){
        var user = ' <li > ';
        user += ' <div class="row user-of-group" > ';
        user += ' <div class="col-sm-3 col-xs-3 user-chat-avatar">';
        user += ' <div class="user-chat-avatar-icon"> ';
        user += ' <img src="./'+ data[i].avatar +'"> '
        user += ' </div> ';
        user += ' </div> ';
        user += ' <div class="col-sm-9 col-xs-9 user-chat-main"> ';
        user += ' <div class="row"> ';
        user += ' <div class="col-sm-8 col-xs-8 user-chat-name"> ';
        user += ' <span class="user-chat-name-meta">'+ data[i].username +'</span> ';
        user += ' </div> ';
        user += ' </div> ';
        user += ' </div> ';
        user += ' </div> ';
        user += ' </li> ';

        $("#people .list-user-in-group").append(user);

    }
});

$(document).ready(function(){
    //=============== SEND ID================
    sendInfoClientToServer();
    sendUserToServer();

    //===============LOGOUT=====================
    $("#btn-click-logout").click(function(){
        var user_id = $(".heading-avatar .heading-avatar-icon").attr('id');
        socket.emit('client-logout',user_id);
    });

    //==================CHAT===================

    // sự kiện khi click send mesage
    $("#btn-click-send-message").click(function() {
         sendMessage();
         sendNotificationToClient();
    });

    // khi click enter để send message
    $("#comment").keyup(function(e){
        var option =  $(document).find(".heading .heading-avatar .heading-avatar-icon-recipient");
        if(option[0].hasAttribute('id')){
            // chat private
            if(e.keyCode == 13){

                sendMessage();
                sendNotificationToClient();
            }
        }else {
            // chat group
            // code chat group here
            if (e.keyCode == 13) {

               sendMessageInGroup();
            }
        }
    });

    // sự kiện foucusin
    $("#comment").focusin(function(){
        var user_typing_avatar = $(".side .side-one .heading .heading-avatar .heading-avatar-icon img").attr('src');
        socket.emit('client-focusin',{user_typing_avatar:user_typing_avatar});
    });

    // sự kiện focus out
    $("#comment").focusout(function(){
        socket.emit('client-focusout');
    });

    //================ CHAT GROUP ===================
    //1.search user in group
     $(document).on('DOMSubtreeModified', ".box-search-user-group .left", function() {
         var username = $(this).text();
         var arrId = [];
         var listUser = $(document).find(".box-search-user-group .right span");
         var  id_create_group = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
         listUser.each(function(){
             arrId.push(parseInt($(this).attr('id')));
         });
        if(username != ""){
            socket.emit('client-send-search-username-to-server',{username:username,arrId:arrId,id_create_group:id_create_group});
        }
     });
     // 2 . create group (name Group + id Group ==> insert group to database )
    $(document).on('click','#btn-click-create-group',function(){
         creatGroupChat();
    });

    // 3. click user chat or group chat
    $(document).on('click','.list-message-history .sideBar-body', function (){

        var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
        var username_recipient = $(this).find(".sideBar-main .sideBar-name .name-meta").text();
        var avatar_recipient = $(this).find(".sideBar-avatar .avatar-icon img").attr('src');

        if($(this)[0].hasAttribute("id")){
            var id_recipient = $(this).attr('id');
            //a. change heading of box private chat
            changeHeadingPrivateChat(id_recipient,username_recipient,avatar_recipient);

            // b. change box chat
            $(".list-message").html("");

            // c. yeu cau server  load lại lịch sử tin nhắn( với người đang chat)
            socket.emit('client-request-get-message-history-to-server',{id_send:id_send, id_recipient:id_recipient, avatar_recipient: avatar_recipient, username_recipient: username_recipient });

            // d. yêu cầu server load lại các tin nhắn trước đó với tất cả user khác
            socket.emit('client-request-get-message-history-with-all-user-to-server',{id_send:id_recipient,recipient_id : id_send });

            // e. ===================CREAT ROOM CHAT ====================
            var room_name = (id_recipient>id_send) ? (id_send+""+id_recipient): (id_recipient+""+id_send);
            socket.emit('creat-room',room_name);


            // f. ==============change list message history=============
            var list  = $(".list-message-history").find('.sideBar-body');
            var arrIdUser = [];
            list.each(function(){
                arrIdUser.push($(this).attr('id'));
            });
            if (arrIdUser.indexOf(id_recipient)>=0){
                var iterm = $(".list-message-history").find('#'+id_recipient);
                $(".list-message-history").prepend(iterm);
            }else{
                insertToMessageHistory(id_recipient,avatar_recipient,username_recipient);
            }

        }else{
            // chat group
            var group_id = $(this).data('group-id');
            $(".list-message-history").prepend($(this));

            //a . change heading box group chat
            changeHeadingBoxGroupChat(group_id,username_recipient);

            // b. change main box chat equals null
            $(".list-message").html("");

            // c. load lai lịch sủ tin nhắn của nhóm chat.
            socket.emit('client-request-get-group-message-history-to-server',{id_send:id_send, group_id : group_id});

            // d. load  change option group
            socket.emit('client-request-get-option-group-to-serve',{group_id : group_id});


            // e. create group chat
            var room_name = $(this).data('name-room');
            socket.emit('creat-room',room_name)
        }
    });


    // 4. change color group chat
    $(document).on('click', '.list-color .box', function(){
        var username_send = $(".side .side-one .heading .heading-username p").text();
        var id_group_chat = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").data('group-id');
        var color = $(this).data('color');
       socket.emit('client-change-color-group-to-server',{user_change: username_send, color : color, time_change : formatDate(new Date()), id_group : id_group_chat});
    });
     // 5. change name member group
    // a. khi click vào option thay đổi tên.
    $(document).on('click', '.change-name-member', function(){
       var group_id = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").data('group-id');
       socket.emit('client-change-name-member-group-chat', {group_id : group_id});
    });

    // b.khi click vào người cần thay đổi tên
    $(document).on('click', '.member', function(){
        var user_change  = $(".side .side-one .heading .heading-username p").text();
        var name_member  = $(this).find(".name-member").text(); // tên ban đầu
        var group_id = $(this).data('group-id');
        var user_id = $(this).data('user-id');

        $("#sub-modal-change-name-member").find(".modal-header .name-member").text(name_member);
        $("#sub-modal-change-name-member").find(".modal-body input").attr('placeholder', name_member);
        $("#sub-modal-change-name-member").modal('show').removeClass('zoomOut');

        $(document).on('click', '#btn-click-change-name-member', function(){
            var nickname  = $("#txt-name-member").val();
            if(nickname != ""){
                socket.emit('client-request-change-name-member-to-server', {group_id : group_id, user_id : user_id, nickname : nickname, time_change : formatDate(new Date()),first_name : name_member, user_change : user_change});
                $("#txt-name-member").val("");
            }
        });
    });

    // 6 .change name group
    $(document).on('click', '#btn-click-change-name-group', function(){

        var group_id = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").data('group-id');
        var user_change  = $(".side .side-one .heading .heading-username p").text();
        var time_change = formatDate(new Date());
        var name_group = $("#txt-name-group").val();

        socket.emit('client-request-change-name-group-to-serve', {group_id : group_id, name_group : name_group, user_change : user_change, time_change : time_change});
    });

    // 7. add user to group
    // a. load all member of group
    $(document).on('click', "#option-group-chat", function(){
        var group_id = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").data('group-id');
        socket.emit('client-request-get-all-user-in-group-to-server', group_id );
    });
    // b. click add user
    
    
    
    // 8. sự kiện tìm kiếm message
    $("#searchText").keyup(function(){
        var text_search = $(this).val().toLowerCase();

        $(".list-message-history .sideBar-body").filter(function() {
            $(this).toggle($(this).find(".sideBar-main .sideBar-name .name-meta strong").text().toLowerCase().indexOf(text_search) > -1);
        });
    });

    $(document).on('mousedown', '.search-message', function(){
        if($(this)[0].hasAttribute("id")){
            // chat private
            var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
            var id_recipient = $(this).attr("id");
            var avatar_recipient = $(this).find(".avatar img").attr('src');
            var username_recipient = $(this).find(".name").text();

            //a. change heading of box private chat
            changeHeadingPrivateChat(id_recipient,username_recipient,avatar_recipient);

            // b. change box chat
            $(".list-message").html("");

            // c. yeu cau server  load lại lịch sử tin nhắn( với người đang chat)
            socket.emit('client-request-get-message-history-to-server',{id_send:id_send, id_recipient:id_recipient, avatar_recipient: avatar_recipient, username_recipient: username_recipient });

            // d .create-room-chat
            var room_name = (id_recipient>id_send) ? (id_send+""+id_recipient): (id_recipient+""+id_send);
            socket.emit('creat-room',room_name);

        }else{
            // chat group
            var group_id = $(this).data('group-id');
            var username_recipient = $(this).find(".name").text();
            var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');

            //a . change heading box group chat
            changeHeadingBoxGroupChat(group_id,username_recipient);

            // b. change main box chat equals null
            $(".list-message").html("");

            // c. load lai lịch sủ tin nhắn của nhóm chat.
            socket.emit('client-request-get-group-message-history-to-server',{id_send:id_send, group_id : group_id});

            // d. load  change option group
            socket.emit('client-request-get-option-group-to-serve',{group_id : group_id});


            // e. create group chat
            var room_name = $(this).data('name-room');
            socket.emit('creat-room',room_name)
        }
    });

    // 9.  tim kiếm user đang online
    $("#searchUser").keyup(function(){
        var username = $(this).val().toLowerCase();
        $(".list-user-online .user-chat-body").filter(function() {
            $(this).toggle($(this).find(".user-chat-main .user-chat-name .user-chat-name-meta").text().toLowerCase().indexOf(username) > -1)
        });
    });

});
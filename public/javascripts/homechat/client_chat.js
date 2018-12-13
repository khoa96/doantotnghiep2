$(document).ready(function () {
	//-------------------------FUNCTION CHO CHUC NANG CHAT ---------------------
	function changeHeadingBoxGroupChat (roomId, roomName, roomAvatar){
		var heading =  ' <div class="col-sm-2 col-md-1 col-xs-3 heading-avatar"> ';
		heading += ' <div class="heading-avatar-icon heading-avatar-icon-recipient" id="'+ roomId +'"> ';
		heading += ' <img src="'+ roomAvatar +'"> ';
		heading += ' </div> ';
		heading += ' </div> ';
		heading += ' <div class="col-sm-8 col-xs-7 heading-name"> ';
		heading += ' <a class="heading-name-meta">'+ roomName +'</a> ';
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

	function sendMessage() {
		var body = $("#comment").val();
		var color = 	$('.sender').css('background-color');
		var group = $(".conversation .heading-avatar-icon-recipient").attr('id'); // id của group
		var userCreator = $(".side .side-one .heading .heading-username p").text();
		var idCreator = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id'); // người  gui tin nhắn vào group
		if (body != '') {
			var message = {
				idCreator: idCreator,
				body: body,
				userCreatdor: userCreator,
				avatarSend: $(".side .side-one .heading .heading-avatar .heading-avatar-icon img").attr('src'),
				group: group,
				time: new Date(),

				currentColor: color,
				type: 'text'
			};
			// send message to server
			socket.emit('client-send-group-message-to-server',message);
			$("#comment").val('');
			
		}

	}
	// ham chuyen doi thoi gian .
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
	
  //------------------------------END FUNCTION ---------------------

  // lang nghe su kien server tra ve tin nhan.( tin nhan emit)
  socket.on('server-broadcast-message-to-room', function(data) {
	var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
	var color = $(document).find(".sender").css('background-color');
    if(data.type == 'text'){
		if(data.idCreator == id_send){
			// thêm tin nhắn vào phía người gui
			var message  = ' <div class="row message-body"> ';
				message += ' <div class="col-sm-12 message-main-sender"> ';
				message += ' <div class="sender"  style="background-color: '+ color +'" > ';
				message += ' <div class="message-text">'+ data.body +' </div>';
				message += ' <span class="message-time pull-right">'+ formatDate(new Date(data.time)) +'</span> ';
				message += ' </div> ';
				message += ' </div> ';
				message += ' </div> ';
				$(".list-message").append(message);
				
				$(document).find(".list-message-history").find('#'+ data.group).find(".message-history").html('<strong>Bạn:'+data.body+'</strong>');
				$(document).find(".list-message-history").find('#'+ data.group).find(".time-meta").html('<strong>'+ formatDate(new Date(data.time)) +'</strong>');
	
				$("#conversation").animate({
				  scrollTop : $('#conversation').get(0).scrollHeight
				});
				$(".sender").css('background-color', data.color)
		} else {
			// nếu tin nhắn ko phải của mình gui đi.
			var message = ' <div class="row message-body"> ';
				message += ' <div class="col-sm-12 message-main-receiver"> ';
				message += ' <div class="left" style="width: 10%;float: left;margin-top: 10px"> ';
				message += '  <img src="'+ data.avatarSend +'" style="display: block;with:40px;height: 40px;border-radius: 50%;margin-top: 15px" data-toggle="tooltip" data-placement="left" title="'+data.username_recipient+'"> ';
				message += ' </div>';
				message += ' <div class="right" style="width: 90%;float: left;">';
				message += ' <div class="receiver">';
				message += ' <div class="message-text" >'+ data.body +'</div> ';
				message += ' <span class="message-time pull-right">'+ formatDate(new Date(data.time)) +'</span>';
				message += ' </div> ';
				message += ' </div> ';
				message += ' </div> ';
				message += ' </div> ';
	
			$('.list-message').append(message);
			$(document).find(".list-message-history").find('#'+ data.group).find(".message-history").html('<strong>'+ data.userCreatdor+ ': ' + data.body+'</strong>');
			$(document).find(".list-message-history").find('#'+ data.group).find(".time-meta").html('<strong>'+ formatDate(new Date(data.time)) +'</strong>');
	
			$("#conversation").animate({
				scrollTop : $('#conversation').get(0).scrollHeight
			});
		}
	} else if(data.type = 'notification') {
		
		var group_notification = '  <div class="change-group-notification" style="text-align: center;margin-top: 10px;margin-bottom: 20px;height: 40px;"> ';
		group_notification += ' <p class="time-change">'+ formatDate(new Date(data.time)) +'</p> ';
		group_notification += ' <p class="content-notification"> ';
		group_notification += ' <span class="content"><strong>'+ data.body +' </span> ';
		group_notification += ' </p> ';
		group_notification += ' </div> ';
	
		// insert notification to list message
		$(".list-message").append(group_notification);
		$("#conversation").animate({
			scrollTop : $('#conversation').get(0).scrollHeight
		});

	} else {
		// dang tin nhan hinh anh.
		console.log('day la  tin nhan hinh anh');
	}
	
  })
  // lang nghe server tra ve tin nhan cua nhom (old list message)
  socket.on('server-send-group-message-history-to-client',function(data){
	 // du lieu tra ve la 1 mang cac message. voi moi message da dc join voi 1 user tuong ung.
	 var creator =  $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
	 var groupId = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").attr('id');
	 for( var i = 0; i < data.length; i++) {
		if(data[i].type == 'text'){
			// neu la tin nhan dang text.
			if(creator == data[i].creator._id) {
				// neu la tin nhan cua user
				var message  = ' <div class="row message-body"> ';
				   message += ' <div class="col-sm-12 message-main-sender"> ';
				   message += ' <div class="sender"> ';
				   message += ' <div class="message-text">'+ data[i].body +' </div>';
				   message += ' <span class="message-time pull-right">'+ formatDate(new Date(data[i].time)) +'</span> ';
				   message += ' </div> ';
				   message += ' </div> ';
				   message += ' </div> ';
				   $(".list-message").append(message);

		    } else {
				// neu kola tin nhan cua user.
				var message = ' <div class="row message-body"> ';
				message += ' <div class="col-sm-12 message-main-receiver"> ';
				message += ' <div class="left" style="width: 10%;float: left;margin-top: 10px"> ';
				message += '  <img src="./uploads/'+ data[i].creator.avatar +'" style="display: block;with:40px;height: 40px;border-radius: 50%;margin-top: 15px" data-toggle="tooltip" data-placement="top" title="'+ data[i].creator.username +'"> ';
				message += ' </div>';
				message += ' <div class="right" style="width: 90%;float: left;">';
				message += ' <div class="receiver">';
				message += ' <div class="message-text" >'+ data[i].body +'</div> ';
				message += ' <span class="message-time pull-right">'+ formatDate(new Date(data[i].time)) +'</span>';
			
				message += ' </div> ';
				message += ' </div> ';
				message += ' </div> ';
				message += ' </div> ';
				$('.list-message').append(message);
   
			}
		

		} else if (data[i].type == 'notification') {
			var group_notification = '  <div class="change-group-notification" style="text-align: center;margin-top: 10px;margin-bottom: 20px;height: 40px;"> ';
			group_notification += ' <p class="time-change">'+ formatDate(new Date(data[i].time)) +'</p> ';
			group_notification += ' <p class="content-notification"> ';
			group_notification += ' <span class="content"><strong>'+ data[i].body +' </span> ';
			group_notification += ' </p> ';
			group_notification += ' </div> ';
		
			// insert notification to list message
			$(".list-message").append(group_notification);
			$("#conversation").animate({
				scrollTop : $('#conversation').get(0).scrollHeight
			});
			
		} else {
			// tin nhan dang hinh anh.
			console.log('tin nhan hinh anh');
		}
	 }
	 	
	 $("#conversation").animate({
		scrollTop : $('#conversation').get(0).scrollHeight
	});
	socket.emit('client-request-get-color-of-group', groupId);

});

	
	// client thay doi mau cua group khi refesh.
	socket.on('server-response-color-group-to-client', function(data) {
		var color = data.color;
		$('.sender').css('background-color',color);
	})

	//Buoc I: click vao 1 cuoc tro chuyen.
	$(document).on('click','.list-message-history .sideBar-body', function (){
      
        var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
        var roomName = $(this).find(".sideBar-main .sideBar-name .name-meta").text();
        var roomAvatar = $(this).find(".sideBar-avatar .avatar-icon img").attr('src');
        var roomId = $(this).attr('id');
	  
		// buoc 1: day room chat dc chon len tren dau tien.
            $(".list-message-history").prepend($(this)[0]);

        // buoc 2 : thay doi noi dung cua heading chat.
           changeHeadingBoxGroupChat(roomId, roomName, roomAvatar);

        // buoc3 :. change main box chat equals null
			$(".list-message").html("");
		
		 // buoc4 : emit len server. neu da nam trong 1 room thi se roi khoi. neu khong se them vao room nay.
            socket.emit('create-room', roomId);
		  
	    // buoc5: load lai lịch sủ tin nhắn của nhóm chat.
			socket.emit('client-request-get-group-message-history-to-server', roomId);
		
       
	});
	
	// Buoc II: Trong cuoc tro chuyen tien hanh gui tin nhan va luu tin nhan.
	// sự kiện khi click send mesage
    $("#btn-click-send-message").click(function() {
		sendMessage();
		//sendNotificationToClient();
   });

   // khi click enter để send message
   $("#comment").keyup(function(e) {
       if(e.keyCode == 13) {
		  sendMessage();
	   }
	   
   });
});
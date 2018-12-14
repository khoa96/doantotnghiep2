$(document).ready(function () {
	//  xu ly cac option khac cua group.

	// 1. lang nghe server tra ve cac user co trong group.
	socket.on('server-response-all-user-in-group-to-client', function(data){
		var users  = data.members;
		$("#people .list-user-in-group").html("");
		for(var i = 0; i < users.length; i++){
			if(users[i].state == 'off') {
				var user = ' <li > ';
					user += ' <div class="row user-of-group" id="'+ users[i]._id +'" > ';
					user += ' <div class="col-sm-3 col-xs-3 user-chat-avatar">';
					user += ' <div class="user-chat-avatar-icon"> ';
					user += ' <img src="./uploads/'+ users[i].avatar +'"> '
					user += ' </div> ';
					user += ' </div> ';
					user += ' <div class="col-sm-9 col-xs-9 user-chat-main"> ';
					user += ' <div class="row"> ';
					user += ' <div class="col-sm-8 col-xs-8 user-chat-name"> ';
					user += ' <span class="user-chat-name-meta">'+ users[i].username +'</span> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </li> ';
		
				$("#people .list-user-in-group").append(user);
			} else {
				var user = ' <li> ';
					user += ' <div class="row user-of-group" id="'+ users[i]._id +'" > ';
					user += ' <div class="col-sm-3 col-xs-3 user-chat-avatar">';
					user += ' <div class="user-chat-avatar-icon"> ';
					user += ' <img src="./uploads/'+ users[i].avatar +'"> '
					user += ' </div> ';
					user += ' </div> ';
					user += ' <div class="col-sm-9 col-xs-9 user-chat-main"> ';
					user += ' <div class="row"> ';
					user += ' <div class="col-sm-8 col-xs-8 user-chat-name"> ';
					user += ' <span class="user-chat-name-meta">'+ users[i].username +'</span> ';
					user += ' </div> ';
					user += ' <div class="col-sm-4 col-xs-4 pull-right "> ';
					user += ' <span class="time-meta pull-right "><span class="user-state" style="margin-top:10px" ></span></span> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';
					user += '</li>';
			    $("#people .list-user-in-group").append(user);
			}

		}
	});

	// 2 . lang nghe su kien them nguoi dung.
	  // 2.1: ket qua tim kiem user theo ten.
	  socket.on('server-send-user-add-to-group-to-client', function(data) {
		  
		  $(document).find(".result-search-user").html("");
		  for (var i = 0; i < data.length; i++) {
			  if(data[i].state == 'off') {
				var user = ' ';
					user += ' <div class="row user-chat-body user-add-to-group" id="'+ data[i]._id +'" > ';
					user += ' <div class="col-sm-3 col-xs-3 user-chat-avatar">';
					user += ' <div class="user-chat-avatar-icon"> ';
					user += ' <img src="./uploads/'+ data[i].avatar +'"> '
					user += ' </div> ';
					user += ' </div> ';
					user += ' <div class="col-sm-9 col-xs-9 user-chat-main"> ';
					user += ' <div class="row"> ';
					user += ' <div class="col-sm-8 col-xs-8 user-chat-name"> ';
					user += ' <span class="user-chat-name-meta" style="font-size: 14px">'+ data[i].username +'</span> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';

			    $(document).find(".result-search-user").append(user);

			  } else {
				var user = ' ';
					user += ' <div class="row user-chat-body user-add-to-group" id="'+ data[i]._id +'" > ';
					user += ' <div class="col-sm-3 col-xs-3 user-chat-avatar">';
					user += ' <div class="user-chat-avatar-icon"> ';
					user += ' <img src="./uploads/'+ data[i].avatar +'"> '
					user += ' </div> ';
					user += ' </div> ';
					user += ' <div class="col-sm-9 col-xs-9 user-chat-main"> ';
					user += ' <div class="row"> ';
					user += ' <div class="col-sm-8 col-xs-8 user-chat-name"> ';
					user += ' <span class="user-chat-name-meta" style="font-size: 14px">'+ data[i].username +'</span> ';
					user += ' </div> ';
					user += ' <div class="col-sm-4 col-xs-4 pull-right "> ';
					user += ' <span class="time-meta pull-right "><span class="user-state" style="margin-top:15px; width: 12px; height: 12px" ></span></span> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';
				
		        $(document).find(".result-search-user").append(user);
			}
		  }
	  })

	  // 2.2: user lang nghe tra ve new room cho user sau khi dc them.
	  socket.on('server-send-room-to-new-use', function(data){
		$(".list-message-history").prepend(data.room);
	  })
	

	//1 . load tat ca nguoi dung. do len option.
	$(document).on('click', "#option-group-chat", function(){
        var group_id = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").attr('id');
        socket.emit('client-request-get-all-user-in-group-to-server', group_id );
	});
	
	// 2. them user vao trong group.
	 // 2.1 : tim kiem  nguoi dung de them vao nhom
	 $(document).on('DOMSubtreeModified', ".search-user-add-to-group", function() {
		var username = $(this).text();
		var userIds = [];
		// danh sach user them khi tim kiem
		var listUser = $(document).find(".add-search-user-to-group span");	
        listUser.each(function(){
            userIds.push($(this).attr('id'));
		});
		// danh sach cac user  ban dau co trong group
		var userOfGroup = $(document).find(".list-user-in-group .user-of-group");
	     userOfGroup.each(function() {
			 userIds.push($(this).attr('id'))
		 })
	   if(username.trim() != ""){
		  socket.emit('client-send-username-add-to-group',{username: username, userIds: userIds});
	   } else {
		$(document).find(".result-search-user").html("");
	   }
	});

	// 2.2: click chon 1 thanh vien va  them vao o danh sach.
	$(document).on('click', '.user-add-to-group', function(){
		var id = $(this).attr('id');
		var username = $(this).find(".user-chat-name .user-chat-name-meta").text();
		var user_lable = '<span class="label label-warning" contenteditable="false" id="'+id+'" >'+username+'</span>';
		$(".add-search-user-to-group").removeAttr('data-placeholder').prepend(user_lable);
		$(".search-user-add-to-group").text("")

	})

	// 2.3 : them cac thanh vien vao trong nhom chat.
	$(document).on('click', '#btn-click-add-user-to-group', function (){
		
		var creatorId = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id'); // người  gui tin nhắn vào group
		var groupId = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").attr('id');
		var creator = $(".side .side-one .heading .heading-username p").text();
		var arrUserIds = [];
		var usernames = creator + ' đã thêm ';
	
		var listUser = $(document).find(".add-search-user-to-group span");	
        listUser.each(function(){
			arrUserIds.push($(this).attr('id'));
			usernames += $(this).text() + ", ";
		});
		var message = {
			idCreator: creatorId,
			body: usernames,
			group: groupId,
			time: new Date(),
			type: 'notification'
		}
		var room = ' <div class="row sideBar-body" id="'+ groupId +'" > ';
		    room +=  $(".list-message-history").find("#" + groupId).html();
		    room += ' </div> ';
		// danh sach cac user  ban dau co trong group
		var userOfGroup = $(document).find(".list-user-in-group .user-of-group");
	     userOfGroup.each(function() {
			 arrUserIds.push($(this).attr('id'))
		 });
		
		// luu message vao trong csdl
	    socket.emit('client-send-group-message-to-server', message);
	   // emit len phia server  yeu cau  them thanh vien vao group.
		socket.emit('add-new-user-to-group', {group: groupId, arrUserIds: arrUserIds, room: room, creator: creatorId});
		
	})
});
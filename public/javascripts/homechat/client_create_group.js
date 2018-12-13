$(document).ready(function () {

	// hàm trả 1 mảng các id của user trong group
	function getArrIdUserInGroup(listUser, id_create_group){
		var arrId = [];
		listUser.each(function (){
			arrId.push($(this).attr('id'));
		});
		arrId.push(id_create_group);
		
		return arrId;
	}
	// ham tra ve ten cua group.
	function getGroupName (listUser,username_create_group){
		var arrUsername = [];
		listUser.each(function (){
			arrUsername.push($(this).text());
		});
		arrUsername.push(username_create_group);
		arrUsername.sort();
		return arrUsername.toString();
	}
	//1. lang nghe server tra ve ket qua tim kiem user theo ten.
	socket.on('server-send-search-result-by-name-to-client',function (data) {
		var search_result_user = $(document).find('.search-result-user-group');
			search_result_user.css('display','block');
			search_result_user.find(".list-user-result").html("");
	   if(data.length > 0){
		  for (var i = 0;i<data.length;i++){
				 var user = '<div class="row sideBar-body user-search" id="'+data[i]._id+'" > ';
				 user += ' <div class="col-sm-2 col-xs-2 sideBar-avatar"> ';
				 user += ' <div class="avatar-icon"> ';
				 user += ' <img src="./uploads/'+data[i].avatar+'"> ';
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

   //2 . lang nghe server tra ve group chat  sau khi tao.
   
   socket.on ('server-broadcast-group-chat-to-client',function (data) {
		var groupName = data.name;
		var groupId = data._id;
		var group = ' <div class="row sideBar-body" id="'+groupId+'" >';
			group += ' <div class="col-sm-3 col-xs-3 sideBar-avatar"> ';
			group += ' <div class="avatar-icon">';
			group += ' <img src="'+ data.avatar_group +'">';
			group += ' </div>';
			group += ' </div> ';
			group += ' <div class="col-sm-9 col-xs-9 sideBar-main">';
			group += ' <div class="row"> ';
			group += ' <div class="col-sm-8 col-xs-8 sideBar-name">';
			group += ' <p class="name-meta" ><strong>'+groupName+'</strong></p>';
			group += ' <p class="message-history">'+groupName+' đã kết nối với nhau</p>';
			group += ' </div>';
			group += ' <div class="col-sm-4 col-xs-4 pull-right sideBar-time"> ';
			group += ' <span class="time-meta pull-right">11:23</span>';
			group += ' </div>';
			group += ' </div>';
			group += ' </div>';
			group += ' </div>';

			$(".list-message-history").prepend(group);

  }); 

  // 3. lang nghe server tra ve nhom chat private.
  socket.on('server-broadcast-private-chat-to-client',function(data) {
	var id_creator_group = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
	if(data.id_creator_group == id_creator_group) {
		
		var group = ' <div class="row sideBar-body" id="'+data._id+'" >';
		group += ' <div class="col-sm-3 col-xs-3 sideBar-avatar"> ';
		group += ' <div class="avatar-icon">';
		group += ' <img src="'+ data.avatar_recepient +'">';
		group += ' </div>';
		group += ' </div> ';
		group += ' <div class="col-sm-9 col-xs-9 sideBar-main">';
		group += ' <div class="row"> ';
		group += ' <div class="col-sm-8 col-xs-8 sideBar-name">';
		group += ' <p class="name-meta" ><strong>'+ data.username_recepient+'</strong></p>';
		group += ' <p class="message-history">nguyen dang khoa hoc vien cong nghe buu chinh vien thong</p>';
		group += ' </div>';
		group += ' <div class="col-sm-4 col-xs-4 pull-right sideBar-time"> ';
		group += ' <span class="time-meta pull-right"></span>';
		group += ' </div>';
		group += ' </div>';
		group += ' </div>';
		group += ' </div>';

		$(".list-message-history").prepend(group);
	} else {
		
		var group = ' <div class="row sideBar-body" id="'+ data._id +'" >';
		group += ' <div class="col-sm-3 col-xs-3 sideBar-avatar"> ';
		group += ' <div class="avatar-icon">';
		group += ' <img src="'+ data.avatar_send +'">';
		group += ' </div>';
		group += ' </div> ';
		group += ' <div class="col-sm-9 col-xs-9 sideBar-main">';
		group += ' <div class="row"> ';
		group += ' <div class="col-sm-8 col-xs-8 sideBar-name">';
		group += ' <p class="name-meta" ><strong>'+ data.username_send +'</strong></p>';
		group += ' <p class="message-history">nguyen dang khoa hoc vien cong nghe buu chinh vien thong</p>';
		group += ' </div>';
		group += ' <div class="col-sm-4 col-xs-4 pull-right sideBar-time"> ';
		group += ' <span class="time-meta pull-right"></span>';
		group += ' </div>';
		group += ' </div>';
		group += ' </div>';
		group += ' </div>';

		$(".list-message-history").prepend(group);
	}


  });

   // 4. lang nghe su kien bao loi khi them phong
   socket.on('server-send-error-create-room-to-client', function(data) {
	   var room_id = data._id;
	   var room = $(".list-message-history").find('#'+ room_id);
	   $(".list-message-history").prepend(room);
   })

	// chat group ( bao gom ca chat hai nguoi va chat nhieu hon 2 nguoi.)
	//Bước 1 : Tìm kiếm người dùng theo tên để thêm vào nhóm.
	$(document).on('DOMSubtreeModified', ".box-search-user-group .left", function() {
		var username = $(this).text();
		var userIds = [];
		var listUser = $(document).find(".box-search-user-group .right span");
		var  id_create_group = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
		userIds.push(id_create_group);
        listUser.each(function(){
            userIds.push($(this).attr('id'));
		});
		 
	   if(username.trim() != ""){
		   socket.emit('client-send-search-username-to-server',{username: username, userIds: userIds});
	   } else {
		 $(document).find('.search-result-user-group').hide();
	   }
	});

	// buoc2 :click create-group : tạo một nhóm chát mới và thêm vao csdl/
	// tên của nhóm chat là tên của các thành viên trong nhóm
$(document).on('click','#btn-click-create-group',function(){

    var listUser = $(document).find('.box-search-user-group .right span'); // danh sach cac user trong nhóm
    var id_create_group = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
    var username_create_group = $(".side .side-one .heading .heading-username p").text();
	var avatar_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon img").attr('src');
	if(listUser.length > 0 ){
		var groupName = getGroupName(listUser,username_create_group);
		var arrUserId = getArrIdUserInGroup(listUser, id_create_group); // lay tat ca id cua cac thanh vien trong group
		if(listUser.length > 1){
			// emit to serve . insert to (group and user_group) in database
			var room = {
				name: groupName,
				avatar_group: './images/group1.png',
				arrUserId: arrUserId
			}
			
			socket.emit('create-group-chat', room);
			
		} else if (listUser.length  == 1) {
		   // day la truong hop chat private.
			 var avatar_recipient = listUser.data('avatar'); // avatar người nhận
			 var username_recepient = listUser.text();
			 var room = {
				name: groupName,
				username_send: username_create_group,
				username_recepient: username_recepient,
				avatar_send: avatar_send,
				avatar_recepient: avatar_recipient,
				id_creator_group: id_create_group,
				arrUserId: arrUserId
			}
			console.log(room);
		    socket.emit('create-group-chat', room);
			
		}
	} else {
		alert('Số thành viên trong phòng phải lớn hơn 1');
	}
    
   });
});
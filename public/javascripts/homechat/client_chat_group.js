$(document).ready(function () {

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

   //2 . lang nghe server tra ve group chat  sa khi tao.
   socket.on ('server-broadcast-group-chat-to-client',function (data) {
    var groupName = data.name;
    var groupId = data._id;
    var group = ' <div class="row sideBar-body" data-group-id="'+groupId+'" >';
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
		 
	   if(username != ""){
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

    if(listUser.length >= 1){
        var groupName = getGroupName(listUser,username_create_group);
		var arrUserId = getArrIdUserInGroup(listUser,id_create_group); // lay tat ca id cua cac thanh vien trong group
        // emit to serve . insert to (group and user_group) in database
		socket.emit('create-group-chat',{groupName : groupName, arrUserId : arrUserId});
		
    } else {
        alert("Phòng chat phải có ít nhất một thành viên");
    }
   });
});
$(document).ready(function () {

	// client lang nghe server tra su thay doi avatar.
	socket.on('server-broadcast-change-avatar-group-to-group', function(data) {
		//thay doi lai avatar cua nhom.
		$(".list-message-history").find("#" + data.group).find(".sideBar-avatar .avatar-icon img").attr('src', data.avatar);
		$(".conversation .heading-avatar").find("#" + data.group).find('img').attr('src', data.avatar);
	})
	// nguoi  dung thay doi avatar cua cuoc tro chuyen.
	$("#avatar-group").change(function (e) { 
		var file = e.target.files[0];
		console.log(file)
		if(file){
			$(document).on('click', '#btn-click-change-avatar-group', function(){
				var creator =  $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
				var userCreator = $(".side .side-one .heading .heading-username p").text();
				var groupId = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").attr('id');
				console.log(groupId)
				var formData = new FormData();
				formData.append('image', file);
				$.ajax({
					type: "post",
					url: "/file",
					data: formData,
					processData: false,
					contentType: false,
					success: function(data){
						// data la ten anh tren server.
						if(data != 'error') {
							if(groupId != ''){
								var message = {
									idCreator: creator,
									body: userCreator + ' Đã thay đổi avatar của cuộc trò chuyện.',
									group: groupId,
									time: new Date(),
									type: 'notification'
				
								}
								console.log(data)
								// luu thong bao vao trong csdl .
								socket.emit('client-send-group-message-to-server',message);
								// cap nhat lai avatar cua nhom tren csdl.
								var room = {
									group: groupId,
									avatar: './uploads/' + data,
								}
								socket.emit('client-change-avatar-group-to-server', room )
							}
						}

					},
					crossDomain: true
					
				});

			})
		}
		e.preventDefault();
		
	});
});
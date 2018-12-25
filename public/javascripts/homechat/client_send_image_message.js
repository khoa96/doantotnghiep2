$(document).ready(function () {
	// su kien thay doi hinh anh 
	
	$("#input-file").change(function(e){
		var creator =  $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
		var userCreator = $(".side .side-one .heading .heading-username p").text();
		var groupId = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").attr('id');
		var file = e.target.files[0];
		var formData = new FormData();
		formData.append('image', files[0]);
		$.ajax({
			type: "post",
			url: "/file",
			data: formData,
			processData: false,
			contentType: false,
			success: function(data){
				// data la ten anh tren server.
                 if(data != 'error') {
					if(groupId != '') {
						console.log(data);
						var message = {
							idCreator: creator,
							body: data,
							userCreatdor: userCreator,
							avatarSend: $(".side .side-one .heading .heading-avatar .heading-avatar-icon img").attr('src'),
							group: groupId,
							time: new Date(),
							type: 'image'
		
						}
						
						socket.emit('client-send-group-message-to-server',message);
					}
				 }
			},
			crossDomain: true
		    
		});
	
	})
	
});






$(document).ready(function () {
	// xu ly su kien khi ngươi dung nhan phim.( dang go tin nhan)
	// lang nghe su kien nguoi dung dang nhap ki tu. 
	socket.on('server-broadcast-client-typing', function(data){
		var typing_message = ' <div class="row message-body message-on-reply">';
			typing_message += ' <div class="col-sm-12 message-main-receiver ">';
			typing_message += ' <div class="left" style="width: 10%;float: left;margin-top: 10px"> ';
			typing_message += '  <img src="'+ data +'" alt="" style="display: block;with:40px;height: 40px;border-radius: 50%;margin-top: 15px"> ';
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

	// client lang nghe server tra ve khi client foucus outline: .
	socket.on('server-broadcast-client-not-typing',function(){
		$(".list-message").find('.message-on-reply').hide();
	});


	 // kich hoat sự kiện foucusin
	 $("#comment").focusin(function(){
		var user_typing_avatar = $(".side .side-one .heading .heading-avatar .heading-avatar-icon img").attr('src');
		console.log(user_typing_avatar);
		socket.emit('client-focusin', user_typing_avatar);
		
	});
	
	// kich hoat su kien focusu outline: 
	 // sự kiện focus out
	 $("#comment").focusout(function(){
        socket.emit('client-focusout');
    });
});
var socket = io();
$(document).ready(function () {

	
	// click su kien client login
	$(".btn-login").click(function() {
		let email = $("#user_email_login").val();
		let password = $("#user_pass_login").val();
		let user_login = {
			email: email,
			password: password
		}
		if(email != '' && password != '') {
			socket.emit('client-send-user-login-to-server', user_login);
		}
	});
});

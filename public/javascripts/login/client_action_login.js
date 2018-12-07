var socket = io();
$(document).ready(function () {
	$(".btn-login").click(function() {
		let email = $("#user_email_login").val();
		let password = $("#user_pass_login").val();
		let user_login = {
			email: email,
			password: password
		}
		if(email != '' && password != '') {
			socket.emit('client-send-user-to-server', user_login);
		}
	});
});
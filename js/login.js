var login = 'no';
var user = null;

function listen_login() {
	var source = new EventSource('php/check_login.php');
	source.onmessage = function(e) {
		var data = JSON.parse(e.data);
		if(data.login != login) {
			login = data.login;
			if(data.login == 'yes') {
				user = data.user;
				onLogin();
			} else {
				user = null;
				onLogout();
			}
		}
	};
}

function onLogin() {
	$("nav").slideDown();
	$("#top_bar #login_state").text(user.name);
	change_page('home');
}

function onLogout() {
	$("nav").slideUp();
	$("#top_bar #login_state").text("未登入");
	change_page('welcome');
}

function logout() {
	$.post('php/user_logout.php', function(data, status) {
		if(status == "success") {
			login = 'no';
			user = null;
			onLogout();
		}
	});
}

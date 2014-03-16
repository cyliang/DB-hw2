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
	$("#top_bar #login_state").text(user.name);
}

function onLogout() {
	change_page('welcome');
}
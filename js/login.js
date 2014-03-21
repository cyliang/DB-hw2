var login = 'no';
var user = null;

function listen_login() {
	var source = new EventSource('php/check_login.php');
	source.onmessage = function(e) {
		var data = JSON.parse(e.data);
		if(data.login != login || data.login == 'yes' && data.user.id != user.id) {
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
	$("#top_bar #login_state").html(user.name);
	change_page('home');

	if(user.is_admin == 1) {
		$(".admin_option").show();
	} else {
		$(".admin_option").hide();
	}
}

function onLogout() {
	$("nav").slideUp();
	$("#top_bar #login_state").html("未登入");
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

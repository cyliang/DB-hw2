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
	$("#user_info #user_name").html("姓名：&nbsp;&nbsp;" + user.name);
	$("#user_info #user_account").html("帳號：&nbsp;&nbsp;" + user.account);
	$("#user_info #user_email").html("Email：" + user.email);
	$("#user_info #user_admin").html("身份：&nbsp;&nbsp;" + (user.is_admin == 1 ? "管理員" : "一般使用者"));
	change_page('home');

	if(user.is_admin == 1) {
		$(".admin_option").show();
	} else {
		$(".admin_option").hide();
	}
	if(user.FB_id != "") {
		onFB_login();
	}
}

function onLogout() {
	$("nav").slideUp();
	$("#top_bar #login_state").html("未登入");
	$("#user_info div[id!=user_FB]").html("");
	onFB_logout();
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

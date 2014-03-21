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
}

function onLogout() {
	$("nav").slideUp();
	$("#top_bar #login_state").html("未登入");
	$("#user_info div").html("");
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

window.fbAsyncInit = function() {
	FB.init({
		appId      : '568266273272509',
		status     : true,
		xfbml      : true
	});
	
	FB.Event.subscribe('auth.authResponseChange', function(response) {
		if(response.status === 'connected') {
			FB.api('/me', {
				locale: 'zh_TW',
				fields: 'picture.width(100).height(100).type(normal),id,name'
			}, function(resp) {
				$("#has_login img").attr("src", resp.picture.data.url);
				$("#has_login span").text(resp.name);
				$("#has_login").show();
			});
		}
	});
};

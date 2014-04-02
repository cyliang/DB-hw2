var login = 'no';
var user = null;
var login_source;

function listen_login() {
	login_source = new EventSource('php/check_login.php');
	login_source.onmessage = function(e) {
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
	page.change_page('home');

	if(user.is_admin == 1) {
		$(".admin_option").show();
	} else {
		$(".admin_option").hide();
	}
	if(user.FB_id != "") {
		connect_FB.onLogin();
	}
}

function onLogout() {
	$("nav").slideUp();
	$("#top_bar #login_state").html("未登入");
	$("#user_info div[id!=user_FB]").html("");
	connect_FB.onLogout();
	page.change_page('welcome');
}

function logout() {
	post('php/user_logout.php', {}, function(data, status) {
		login = 'no';
		user = null;
		onLogout();
	});
}

function post(URL, data, onSuccess, onFail) {
	$.post(URL, data, function(data, status) {
		if(status != "success") {
			alert("連線錯誤：請稍候再試");
		} else if(data.status == "not_login") {
			alert("請登入後再繼續");
			logout();
		} else if(data.status == "not_admin") {
			alert("權限錯誤：必須為管理員");
			logout();
		} else if(data.status != "success") {
			if(data.msg) {
				alert(data.msg);
			} else {
				alert("發生錯誤，已通報系統管理員，請稍候再試。");
			}
			if(onFail) {
				onFail(data, status);
			}
		} else {
			onSuccess(data, status);
		}
	}, "json");
}

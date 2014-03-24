user_fb = null;
login_fb = 'no';

function prepare_connect_FB() {
}

function connect_FB_init() {
	if(login_fb == 'yes') {
		$("#uconnect #uconnect_facebook .FB_login").hide();
		$("#uconnect #uconnect_facebook span").html('<a href="#" onClick="disconnect_FB()">中斷連結</a>');
		$("#uconnect #uconnect_facebook span").show();
	} else {
		$("#uconnect #uconnect_facebook span").hide();
	}
}

function connect_FB_reset() {
	$("#uconnect #uconnect_facebook .FB_login").show();
	$("#uconnect #uconnect_facebook span").hide();
	$("#uconnect #uconnect_facebook span").html("");
}

window.fbAsyncInit = function() {
	FB.init({
		appId      : '568266273272509',
		status     : false,
		xfbml      : true
	});

	if(login == 'yes' && user.FB_id != "") {
		onFB_login();
	}
};

function connect_FB() {
	FB.login(function(response) {
		if(response.status === 'connected') {
			$.post('php/connect_FB.php', {fb: response.authResponse.userID}, function(data, status) {
				if(status == 'success' && data == 'success') {
					user.FB_id = response.authResponse.userID;
					onFB_login();
				} else {
					alert("發生錯誤！");
				}
			});
		}
	});
}

function disconnect_FB() {
	$.post('php/connect_FB.php', {fb: ""}, function(data, status) {
		if(status == 'success' && data == 'success') {
			onFB_logout();
		} else {
			alert("發生錯誤");
		}
	});
}

function onFB_login() {
	FB.api("/" + user.FB_id, {
		locale: "zh_TW",
		fields: "picture.width(74).height(74),name"
	}, function(response) {
		$("#user_info #user_FB #user_FB_name").text("Facebook登入為：" + response.name);
		$("#user_info #user_FB img").attr("src", response.picture.data.url);

		user_fb = {name: response.name};
		login_fb = 'yes'

		if(now_page == 'connect_account') {
			connect_FB_init();
		}
	});
}

function onFB_logout() {
	user_fb = null;
	login_fb = 'no';
	$("#user_info #user_FB img").attr("src", "");
	$("#user_info #user_FB #user_FB_name").text("");

	if(now_page == 'connect_account') {
		connect_FB_reset();
	}
}

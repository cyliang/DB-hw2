var connect_FB = new Object();
connect_FB.user = null;
connect_FB.login = 'no';

connect_FB.div_id = "uconnect";
connect_FB.title = "連結帳號";
connect_FB.init = function() {
	if(connect_FB.login == 'yes') {
		$("#uconnect #uconnect_facebook .FB_login").hide();
		$("#uconnect #uconnect_facebook span").html('<a href="#" onClick="connect_FB.disconnect()">中斷連結</a>');
		$("#uconnect #uconnect_facebook span").show();
	} else {
		$("#uconnect #uconnect_facebook span").hide();
	}
}

connect_FB.reset = function() {
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
		connect_FB.onLogin();
	}
};

connect_FB.connect = function() {
	FB.login(function(response) {
		if(response.status === 'connected') {
			post('php/connect_FB.php', {fb: response.authResponse.userID}, function(data, status) {
					connect_FB.onLogin();
			});
		}
	});
}

connect_FB.disconnect = function() {
	post('php/connect_FB.php', {fb: ""}, function(data, status) {
		connect_FB.onLogout();
	});
}

connect_FB.onLogin = function() {
	FB.api("/" + user.FB_id, {
		locale: "zh_TW",
		fields: "picture.width(74).height(74),name"
	}, function(response) {
		$("#user_info #user_FB #user_FB_name").text("Facebook登入為：" + response.name);
		$("#user_info #user_FB img").attr("src", response.picture.data.url);

		connect_FB.user = {name: response.name};
		connect_FB.login = 'yes'

		if(page.now_page == 'connect_account') {
			connect_FB.init();
		}
	});
}

connect_FB.onLogout = function() {
	this.user = null;
	this.login = 'no';
	$("#user_info #user_FB img").attr("src", "");
	$("#user_info #user_FB #user_FB_name").text("");

	if(page.now_page == 'connect_account') {
		this.reset();
	}
}

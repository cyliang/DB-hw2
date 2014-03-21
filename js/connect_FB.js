function prepare_connect_FB() {
}

window.fbAsyncInit = function() {
	FB.init({
		appId      : '568266273272509',
		status     : false,
		xfbml      : true
	});
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

function onFB_login() {
	FB.api("/" + user.FB_id, {
		locale: "zh_TW",
		fields: "picture.type(square),name"
	}, function(response) {
		$("#user_info #user_FB #user_FB_name").text(response.name);
		$("#user_info #user_FB img").attr("src", response.picture.data.url);
	});
}


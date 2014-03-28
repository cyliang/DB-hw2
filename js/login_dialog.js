var login_dialog = new Object();

login_dialog.div_id = "login_dialog";
login_dialog.title = "使用者登入";
login_dialog.prepare = function() {
	$("#login_dialog #links a").first().hover(function() {
		$("#login_dialog #what_new_user").slideDown();
	}, function() {
		$("#login_dialog #what_new_user").slideUp();
	});
	
	$("#login_dialog #links a").last().hover(function() {
		$("#login_dialog #what_reset_pwd").slideDown();
	}, function() {
		$("#login_dialog #what_reset_pwd").slideUp();
	});
	
	$("#login_dialog #login_form").submit(function() {
		event.preventDefault();
		
		$(this).slideUp(function() {
			$("#login_dialog #login_wait").slideDown(function() {
				$.post('php/user_login.php', $("#login_dialog #login_form").serialize(), function(data, status) {
					if(status != 'success') {
						alert('發生錯誤，已通報系統管理員，請稍後再重試');
						return;
					}
					
					if(data.login == 'yes') {
						login = 'yes';
						user = data.user;
						onLogin();
					} else {
						alert("帳號或密碼輸入錯誤！");
						$("#login_dialog input[type=password]").val("");
						$("#login_dialog #login_wait").slideUp(function() {
							$("#login_dialog #login_form").slideDown();
						});
					}
				}, "json");
			});
		});
	});
}

login_dialog.reset = function() {
	$("#login_dialog input").val("");
	$("#login_dialog #login_wait").hide();
	$("#login_dialog form").show();
}

login_dialog.reset_password = function() {
	var email = prompt("請輸入您的Email");
	alert("很抱歉，目前郵件伺服器無法正常工作，若您需要登入建議註冊新的帳號，謝謝！");
}

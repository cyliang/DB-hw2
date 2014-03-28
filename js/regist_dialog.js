var regist_dialog = new Object();

regist_dialog.div_id = "regist_dialog";
regist_dialog.title = "註冊新使用者";
regist_dialog.prepare = function() {	
	$("#regist_dialog #new_first").submit(function() {
		event.preventDefault();
		$("#regist_dialog #new_first input").attr("readonly", "");
		
		$("#regist_dialog #new_first .button").slideUp(function() {
			$("#regist_dialog #new_second").slideDown();
		});
	});
	
	$("#regist_dialog #new_uname input").change(function() {
		$.post('php/check_user_exist.php', {username: $(this).val()}, function(data) {
			if(data == "true") {
				$("#regist_dialog #new_uname .warning").slideDown();
			} else {
				$("#regist_dialog #new_uname .warning").slideUp();
			}
		}, "text");
	});
	
	$("#regist_dialog #new_second #new_rewrite").click(function() {
		$("#regist_dialog #new_second").slideUp(function() {
			$("#regist_dialog #new_first .button").slideDown();
		});
		
		$("#regist_dialog input[type!='checkbox']").val("");
		$("#regist_dialog #admin_chk").removeAttr("checked");
		$("#regist_dialog #new_first input").removeAttr("readonly");
	});
	
	$("#regist_dialog #new_second").submit(function() {
		event.preventDefault();
		
		if($("#regist_dialog #new_pwd input").val() != $("#regist_dialog #new_confirm_pwd input").val()) {
			$("#regist_dialog #new_confirm_pwd .warning").slideDown();
			return;
		} else {
			$("#regist_dialog #new_confirm_pwd .warning").slideUp();
		}
		
		$("#regist_dialog form input").attr("readonly", "");
		$("#regist_dialog #new_second .button").slideUp(function() {
			$("#regist_dialog #new_wait").slideDown(function() {
				$.post('php/add_user.php', $("#regist_dialog form").serialize(), function(data, status) {
					if(status != "success") {
						alert('發生錯誤，已通報系統管理員，請稍後再重試');
					}
				}, "script");
			});
		});
	});
}

regist_dialog.reset = function() {
	$("#regist_dialog input[type!='checkbox']").val("");
	$("#regist_dialog #admin_chk").removeAttr("checked");
	$("#regist_dialog form input").removeAttr("readonly");
	$("#regist_dialog .button, #regist_dialog #new_first").show();
	$("#regist_dialog > div, #regist_dialog #new_second").hide();
}

regist_dialog.success = function() {
	$("#regist_dialog form").slideUp(function() {
		$("#regist_dialog #new_wait").slideUp(function() {
			$("#regist_dialog #regist_success").slideDown();
		});
	});
}

regist_dialog.fail = function(message) {
	$("#regist_dialog #new_wait").slideUp(function() {
		alert(message);
		$("#regist_dialog form input").removeAttr("readonly");
		$("#regist_dialog #new_second .button").slideDown();
	});
}

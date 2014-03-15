function prepare_regist_dialog() {	
	$("#regist_dialog #new_first").submit(function() {
		event.preventDefault();
		$("#regist_dialog #new_first input").attr("readonly", "");
		
		$("#regist_dialog #new_first .button").slideUp(function() {
			$("#regist_dialog #new_second").slideDown();
		});
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
				regist_success();
			});
		});
	});
}

function reset_regist_dialog() {
	$("#regist_dialog input[type!='checkbox']").val("");
	$("#regist_dialog #admin_chk").removeAttr("checked");
	$("#regist_dialog #new_first input").removeAttr("readonly");
	$("#regist_dialog .button, #regist_dialog #new_first").show();
	$("#regist_dialog > div, #regist_dialog #new_second").hide();
}

function regist_success() {
	$("#regist_dialog form").slideUp(function() {
		$("#regist_dialog #new_wait").slideUp(function() {
			$("#regist_dialog #regist_success").slideDown();
		});
	});
}

function regist_fail(message) {
	$("#regist_dialog #new_wait").slideUp(function() {
		alert(message);
		$("#regist_dialog form input").removeAttr("readonly");
		$("#regist_dialog #new_second .button").slideDown();
	});
}
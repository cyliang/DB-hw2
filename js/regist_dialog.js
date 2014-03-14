function prepare_regist_dialog() {
	$("#regist_dialog #new_pwd input, #regist_dialog #new_confirm_pwd input").change(function() {
		if($("#regist_dialog #new_pwd input").val() != "" && $("#regist_dialog #new_confirm_pwd input").val() != "" && $("#regist_dialog #new_pwd input").val() != $("#regist_dialog #new_confirm_pwd input").val()) {
			$("#regist_dialog #new_confirm_pwd .warning").slideDown();
		} else {
			$("#regist_dialog #new_confirm_pwd .warning").slideUp();
		}
	});
	
	$("#regist_dialog #new_rname input, #regist_dialog #new_email input").change(function() {
		if($("#regist_dialog #new_rname input").val() != "" && $("#regist_dialog #new_email input").val() != "") {
			$("#regist_dialog #new_second").slideDown();
		}
	});
}
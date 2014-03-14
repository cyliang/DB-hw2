function prepare_regist_dialog() {
	$("#regist_dialog #new_pwd input, #regist_dialog #new_confirm_pwd input").change(function() {
		if($("#regist_dialog #new_pwd input").val() != "" && $("#regist_dialog #new_confirm_pwd input").val() != "" && $("#regist_dialog #new_pwd input").val() != $("#regist_dialog #new_confirm_pwd input").val()) {
			$("#regist_dialog #new_confirm_pwd .warning").slideDown();
		} else {
			$("#regist_dialog #new_confirm_pwd .warning").slideUp();
		}
	});
	
	$("#regist_dialog #new_rname input, #regist_dialog #new_email input").change(function() {
		var email_pat = new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$","i");
		
		if($("#regist_dialog #new_email input").val() != "") {
			if(!email_pat.test($("#regist_dialog #new_email input").val())) {
				$("#regist_dialog #new_email .warning").slideDown();
			} else {
				$("#regist_dialog #new_email .warning").slideUp();
				if($("#regist_dialog #new_rname input").val() != "") {
					$("#regist_dialog #new_second").slideDown();
				}
			}
		}
	});
}
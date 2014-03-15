function prepare_regist_dialog() {	
	$("#regist_dialog #new_first").submit(function() {
		event.preventDefault();
		$("#regist_dialog #new_first input").attr("readonly", "");
		
		$("#regist_dialog #new_first button[type=submit]").slideUp(function() {
			$("#regist_dialog #new_second").slideDown();
		});
	});
	
	$("#regist_dialog #new_second #new_rewrite").click(function() {
		$("#regist_dialog #new_second").slideUp(function() {
			$("#regist_dialog #new_first button[type=submit]").slideDown();
		});
		
		$("#regist_dialog input[type!='checkbox']").val("");
		$("#regist_dialog #admin_chk").removeAttr("checked");
		$("#regist_dialog #new_first input").removeAttr("readonly");
	});
	
	$("#regist_dialog #new_second").submit(function() {
		event.preventDefault();
		
		if($("#regist_dialog #new_pwd input").val() != $("#regist_dialog #new_confirm_pwd input").val() || $("#regist_dialog #new_pwd input").val() == "") {
			$("#regist_dialog #new_confirm_pwd .warning").slideDown();
		} else {
			$("#regist_dialog #new_confirm_pwd .warning").slideUp();
		}
	});
}
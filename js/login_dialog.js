function prepare_login_dialog() {
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
	
	$("#login_dialog #other_login").hover(function() {
		$("#login_dialog #why_other_login").slideDown();
	}, function() {
		$("#login_dialog #why_other_login").slideUp();
	});
}
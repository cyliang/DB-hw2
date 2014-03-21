function prepare_uset() {
	$("#uset #uset_form").submit(function() {
		event.preventDefault();
	});
}

function uset_onEnter() {
	$("#uset #uset_rname input").attr("placeholder", "姓名：" + user.name);
	$("#uset #uset_email input").attr("placeholder", "Email：" + user.email);
	if(user.is_admin == 1) {
		$("#uset #uset_admin input").attr("checked", "");
	} else {
		$("#uset #uset_admin input").removeAttr("checked");
	}
}

function reset_uset() {
	$("#uset input[type!=checkbox]").val("");
}
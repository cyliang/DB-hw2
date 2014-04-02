var uset = new Object();

uset.div_id = "uset";
uset.title = "使用者設定";
uset.prepare = function() {
	$("#uset #uset_form").submit(function() {
		event.preventDefault();
		
		if($("#uset #uset_pwd input").val() != $("#uset #uset_confirm_pwd input").val()) {
			alert("兩次輸入的密碼不符合！");
			$("#uset #uset_pwd input, #uset #uset_confirm_pwd input").val("");
			return;
		}
		
		var edit_data = new Object();
		if($("#uset #uset_rname input").val() != "") {
			edit_data.name = $("#uset #uset_rname input").val();
		}
		if($("#uset #uset_email input").val() != "") {
			edit_data.email = $("#uset #uset_email input").val();
		}
		if($("#uset #uset_pwd input").val() != "") {
			edit_data.password = $("#uset #uset_pwd input").val();
		}
		if($("#uset #uset_admin input").prop("checked") != (user.is_admin == 1)) {
			edit_data.admin = $("#uset #uset_admin input").prop("checked") ? 'yes' : 'no';
		}
		
		if(Object.keys(edit_data).length > 0) {
			post('php/edit_user.php', edit_data, function(data, status) {
				alert("修改成功！請重新登入");
				logout();
			});
		}
	});
}

uset.init = function() {
	$("#uset #uset_rname input").attr("placeholder", "姓名：" + user.name);
	$("#uset #uset_email input").attr("placeholder", "Email：" + user.email);
	if(user.is_admin == 1) {
		$("#uset #uset_admin input").attr("checked", "");
	} else {
		$("#uset #uset_admin input").removeAttr("checked");
	}
}

uset.reset = function() {
	$("#uset input[type!=checkbox]").val("");
}

var users_manage = new Object();
users_manage.div_id = "users_manage";
users_manage.title = "使用者管理";

users_manage.now_page = 1;
users_manage.total_page = 0;
users_manage.page_data;

users_manage.prepare = function() {
	$("#users_manage #users_page_control #users_p_select").bind('input', function() {
		if($(this).val() != "" && $(this).val() != users_manage.now_page) {
			users_manage.goto_page($(this).val());
		}
	});
}

users_manage.goto_page = function(page, callback) {
	switch(page) {
	case "first":
		page = 1;
		break;
	case "last":
		page = this.total_page;
		break;
	case "previous":
		if(this.now_page > 1) {
			page = this.now_page - 1;
		}
		break;
	case "next":
		if(this.now_page < this.total_page) {
			page = this.now_page + 1;
		}
		break;
	case "now":
		page = this.now_page;
		break;
	}
	
	$.post('php/list_users.php', {
		page: page,
	}, function(data, status) {
		if(status != 'success') {
			alert('發生錯誤，已通報系統管理員，請稍後再重試');
			return;
		}
		if(data.status != 'OK') {
			if(data.status == 'not_login') {
				login = no;
				onLogout();
			}
			return;
		}

		users_manage.now_page = page;
		users_manage.total_page = data.page_count;
		users_manage.page_data = data.data;

		$("#users_manage tbody").empty();
		for(var user in data.data) {
			$("#users_manage tbody").append((user % 2 == 1 ? '<tr class="alt"' : "<tr") + ' id="users_row' + user + '">' +
					'<td><a href="#" onClick="users_manage.editing(' + user + ')">管理</a></td>' +
					'<td>' + data.data[user].account + "</td>" +
					'<td>' + (data.data[user].is_admin ? "管理員" : "一般使用者") + "</td>" +
					'<td>' + data.data[user].name + "</td>" +
					'<td>' + data.data[user].email + "</td>" +
					"</tr>");
		}
		
		$("#users_manage #users_page_control #users_p_select").attr("placeholder", page + ' / ' + users_manage.total_page);
									.val("");
		$("#users_manage #users_page_control #users_p_list").empty();
		for(var i = 1; i <= users_manage.total_page; i++) {
			$("#users_manage #users_page_control #users_p_list").append('<option val="' + i + '">' + i + '</option>');
		}
		
		if(users_manage.now_page <= 1) {
			$("#users_manage #users_page_control #users_p_first").hide();
			$("#users_manage #users_page_control #users_p_previous").hide();
		} else {
			$("#users_manage #users_page_control #users_p_first").show();
			$("#users_manage #users_page_control #users_p_previous").show();
		}
		if(users_manage.now_page >= users_manage.total_page) {
			$("#users_manage #users_page_control #users_p_last").hide();
			$("#users_manage #users_page_control #users_p_next").hide();
		} else {
			$("#users_manage #users_page_control #users_p_last").show();
			$("#users_manage #users_page_control #users_p_next").show();
		}
		
		if(callback) {
			callback();
		}
	}, 'json');
}

flight.init = function() {
	flight.now_page = 1;
	flight.goto_page(1);
}

flight.editing = function(row) {
}

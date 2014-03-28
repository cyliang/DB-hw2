var flight = new Object();
flight.now_page = 1;
flight.total_page = 0;
flight.sort_by = 'id';
flight.page_data;

flight.div_id = "flight_manage";
flight.title = "航班管理";
flight.prepare = function() {
	$("#flight_manage tfoot .date_input").datetimepicker({
		dateFormat: 'yy-mm-dd',
		clockType: 24
	});
	$("#flight_manage #flight_page_control #flight_p_select").bind('input', function() {
		if($(this).val() != "" && $(this).val() != flight.now_page) {
			flight.goto_page($(this).val());
		}
	});

	$("#flight_manage #flight_add_form").submit(function() {
		event.preventDefault();
		
		$("#flight_manage #flight_add_cancal, #flight_manage #flight_add_save").hide();
		$.post('php/add_flight.php', $("#flight_manage tfoot input").serialize(), function(data, status) {
			if(status != 'success') {
				alert('發生錯誤，已通報系統管理員，請稍後再重試');
			} else if(data == 'not_admin') {
				alert('身分錯誤！必須為管理員');
				return;
			} else if(data != 'success') {
				alert('發生錯誤，已通報系統管理員，請稍後再重試');
				return;
			}
			
			flight.goto_page("last");
		});
	});
	
	$("#flight_manage #flight_update_form").submit(function() {
		event.preventDefault();
		
		$.post('php/edit_flight.php', $("#flight_manage tbody input").serialize(), function(data, status) {
			if(status != 'success') {
				alert('發生錯誤，已通報系統管理員，請稍後再重試');
			} else if(data == 'not_admin') {
				alert('身分錯誤！必須為管理員');
				return;
			} else if(data != 'success') {
				alert('發生錯誤，已通報系統管理員，請稍後再重試');
				return;
			}
			
			flight.goto_page("now");
		});
	});
}

flight.goto_page = function(page, callback) {
	switch(page) {
	case "first":
		page = 1;
		break;
	case "last":
		page = flight.total_page;
		break;
	case "previous":
		if(flight.now_page > 1) {
			page = flight.now_page - 1;
		}
		break;
	case "next":
		if(flight.now_page < flight.total_page) {
			page = flight.now_page + 1;
		}
		break;
	case "now":
		page = flight.now_page;
		break;
	}
	
	$.post('php/list_flight.php', {
		page: page,
		sortby: flight.sort_by
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

		flight.now_page = page;
		flight.total_page = data.page_count;
		flight.page_data = data.data;

		$("#flight_manage tbody").empty();
		for(var plain in data.data) {
			$("#flight_manage tbody").append((plain % 2 == 1 ? '<tr class="alt"' : "<tr") + ' id="plain_row' + plain + '">' +
					(user.is_admin == 1 ? '<td class="plain_control"><a href="#" onClick="flight.editing(' + plain + ')"><span class="icon-pen"></span></a><a href="#" onClick="flight.remove(' + plain + ')"><span class="icon-trash"></span></a></td>' : "") +
					'<td class="plain_id">' + data.data[plain].id + "</td>" +
					'<td class="plain_no">' + data.data[plain].flight_number + "</td>" +
					'<td class="plain_dept">' + data.data[plain].departure + "</td>" +
					'<td class="plain_dept_date">' + data.data[plain].departure_date + "</td>" +
					'<td class="plain_dest">' + data.data[plain].destination + "</td>" +
					'<td class="plain_dest_date">' + data.data[plain].arrival_date + "</td>" +
					'<td class="plain_price">' + data.data[plain].ticket_price + "</td>" +
					"</tr>");
		}
		
		$("#flight_manage #flight_page_control #flight_p_select").attr("placeholder", page + ' / ' + flight.total_page);
		$("#flight_manage #flight_page_control #flight_p_select").val("");
		$("#flight_manage #flight_page_control #flight_p_list").empty();
		for(var i = 1; i <= flight.total_page; i++) {
			$("#flight_manage #flight_page_control #flight_p_list").append('<option val="' + i + '">' + i + '</option>');
		}
		
		if(flight.now_page <= 1) {
			$("#flight_manage #flight_page_control #flight_p_first").hide();
			$("#flight_manage #flight_page_control #flight_p_previous").hide();
		} else {
			$("#flight_manage #flight_page_control #flight_p_first").show();
			$("#flight_manage #flight_page_control #flight_p_previous").show();
		}
		if(flight.now_page >= flight.total_page) {
			$("#flight_manage #flight_page_control #flight_p_last").hide();
			$("#flight_manage #flight_page_control #flight_p_next").hide();
		} else {
			$("#flight_manage #flight_page_control #flight_p_last").show();
			$("#flight_manage #flight_page_control #flight_p_next").show();
		}
		
		flight.adding_reset();
		if(callback) {
			callback();
		}
	}, 'json');
}

flight.init = function() {
	flight.adding_reset();
	flight.now_page = 1;
	flight.goto_page(1);
}

flight.editing = function(row) {
	this.goto_page("now", function() {
		var id_field = $("#flight_manage tbody #plain_row" + row + " .plain_id");
		var no_field = $("#flight_manage tbody #plain_row" + row + " .plain_no");
		var dept_field = $("#flight_manage tbody #plain_row" + row + " .plain_dept");
		var dept_date_field = $("#flight_manage tbody #plain_row" + row + " .plain_dept_date");
		var dest_field = $("#flight_manage tbody #plain_row" + row + " .plain_dest");
		var dest_date_field = $("#flight_manage tbody #plain_row" + row + " .plain_dest_date");
		var price_field = $("#flight_manage tbody #plain_row" + row + " .plain_price");
		
		id_field.html('<input type="hidden" name="id" value="' + flight.page_data[row].id + '" />' + id_field.text());
		no_field.html('<input type="text" name="number" value="' + flight.page_data[row].flight_number + '" required pattern="^\\S+$" title="班機號碼不得包含空白" />');
		dept_field.html('<input type="text" name="departure" value="' + flight.page_data[row].departure + '" required pattern="^\\S+$" title="起飛機場不得包含空白" />');
		dept_date_field.html('<input type="datetime-local" name="departure_date" value="' + flight.page_data[row].departure_date.replace(" ", "T") + '" required />');
		dest_field.html('<input type="text" name="destination" value="' + flight.page_data[row].destination + '" required pattern="^\\S+$" title="到達機場不得包含空白" />');
		dest_date_field.html('<input type="datetime-local" name="arrival_date" value="' + flight.page_data[row].arrival_date.replace(" ", "T") + '" required />');
		price_field.html('<input type="number" name="price" form="flight_add_form" placeholder="機票價格 Ticket Price" min="0" max="99999999.99" step="0.01" value="' + flight.page_data[row].ticket_price + '" required />');
		
		$("#flight_manage tbody #plain_row" + row + " .plain_control").html(
			'<button type="submit"></button>' +
			'<a href="#" onClick="$(\'#flight_manage tbody #plain_row' + row + ' .plain_control button\').click()">' +
				'<span class="icon-checkmark-circle"></span>' +
			'</a>' +
			'<a href="#" onClick="flight.goto_page(\'now\')">' +
				'<span class="icon-cancel-circle"></span>' +
			'</a>'
		);
		$("#flight_manage tbody #plain_row" + row + " .plain_control button").hide();
	});
}

flight.remove = function(row) {
	if(confirm("真的要刪除此航班嗎？\n班機編號：" + flight.page_data[row].flight_number + "\n起飛：" + flight.page_data[row].departure_date + "於" + flight.page_data[row].departure + "\n降落：" + flight.page_data[row].arrival_date + "於" + flight.page_data[row].destination + "\n價格：" + flight.page_data[row].ticket_price)) {
		$.post('php/delete_flight.php', {id: flight.page_data[row].id}, function(data, status) {
			if(status != 'success') {
				alert('發生錯誤，已通報系統管理員，請稍後再重試');
			} else if(data == 'not_admin') {
				alert('身分錯誤！必須為管理員');
				return;
			} else if(data != 'success') {
				alert('發生錯誤，已通報系統管理員，請稍後再重試');
				return;
			}
			
			flight.goto_page("now");
		});
	}
}

flight.adding = function() {
	flight.goto_page("now", function() {
		$("#flight_manage #flight_add").hide();
		$("#flight_manage #flight_add_cancel").show();
		$("#flight_manage #flight_add_save").show();
		$("#flight_manage tfoot").show();
	});
}

flight.adding_reset = function() {
	$("#flight_manage #flight_add_cancel").hide();
	$("#flight_manage #flight_add_save").hide();
	$("#flight_manage #flight_add").show()
	$("#flight_manage tfoot").hide();
	$("#flight_manage tfoot input").val("");
}

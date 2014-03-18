var flight_now_page = 1;
var flight_total_page = 0;
var flight_sort_by = 'id';

function prepare_flight() {
	$("#flight_manage #flight_page_control #flight_p_select").bind('input', function() {
		if($(this).val() != "" && $(this).val() != flight_now_page) {
			flight_goto_page($(this).val());
		}
	});

	$("#flight_manage > form").submit(function() {
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
			
			flight_adding_reset();
			flight_goto_page("last");
		});
	});
}

function flight_goto_page(page) {
	switch(page) {
	case "first":
		page = 1;
		break;
	case "last":
		page = flight_total_page;
		break;
	case "previous":
		if(flight_now_page > 1) {
			page = flight_now_page - 1;
		}
		break;
	case "next":
		if(flight_now_page < flight_total_page) {
			page = flight_now_page + 1;
		}
		break;
	}
	
	$.post('php/list_flight.php', {
		page: page,
		sortby: flight_sort_by
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

		flight_now_page = page;
		flight_total_page = data.page_count;

		$("#flight_manage tbody").empty();
		for(var plain in data.data) {
			$("#flight_manage tbody").append((plain % 2 == 1 ? '<tr class="alt"' : "<tr") + ' id="plain_row' + plain + '">' +
					(user.is_admin == 1 ? '<td><span class="icon-pen" onClick="flight_editing(' + plain + ')"></span><span class="icon-trash"></span></td>' : "") +
					'<td class="plain_id">' + data.data[plain].id + "</td>" +
					'<td class="plain_no">' + data.data[plain].flight_number + "</td>" +
					'<td class="plain_dept">' + data.data[plain].departure + "</td>" +
					'<td class="plain_dept_date">' + data.data[plain].departure_date + "</td>" +
					'<td class="plain_dest">' + data.data[plain].destination + "</td>" +
					'<td class="plain_dest_date">' + data.data[plain].arrival_date + "</td>" +
					"</tr>");
		}
		
		$("#flight_manage #flight_page_control #flight_p_select").attr("placeholder", page + ' / ' + flight_total_page);
		$("#flight_manage #flight_page_control #flight_p_select").val("");
		$("#flight_manage #flight_page_control #flight_p_list").empty();
		for(var i = 1; i <= flight_total_page; i++) {
			$("#flight_manage #flight_page_control #flight_p_list").append('<option val="' + i + '">' + i + '</option>');
		}
		
		if(flight_now_page <= 1) {
			$("#flight_manage #flight_page_control #flight_p_first").hide();
			$("#flight_manage #flight_page_control #flight_p_previous").hide();
		} else {
			$("#flight_manage #flight_page_control #flight_p_first").show();
			$("#flight_manage #flight_page_control #flight_p_previous").show();
		}
		if(flight_now_page >= flight_total_page) {
			$("#flight_manage #flight_page_control #flight_p_last").hide();
			$("#flight_manage #flight_page_control #flight_p_next").hide();
		} else {
			$("#flight_manage #flight_page_control #flight_p_last").show();
			$("#flight_manage #flight_page_control #flight_p_next").show();
		}
	}, 'json');
}

function flight_manage_onEnter() {
	flight_adding_reset();
	flight_now_page = 1;
	flight_goto_page(1);
}

function reset_flight_manage() {
}

function flight_editing(row) {
	var id_field = $("#flight_manage tbody #plain_row" + row + " .plain_id");
	var no_field = $("#flight_manage tbody #plain_row" + row + " .plain_no");
	var dept_field = $("#flight_manage tbody #plain_row" + row + " .plain_dept");
	var dept_date_field = $("#flight_manage tbody #plain_row" + row + " .plain_dept_date");
	var dest_field = $("#flight_manage tbody #plain_row" + row + " .plain_dest");
	var dest_date_field = $("#flight_manage tbody #plain_row" + row + " .plain_dest_date");
	
	id_field.html('<input type="hidden" name="id" value="' + id_field.text() + '" />' + id_field.text());
	no_field.html('<input type="text" name="number" value="' + no_field.text() + '" />');
	dept_field.html('<input type="text" name="departure" value="' + dept_field.text() + '" />');
	dept_date_field.html('<input type="datetime-local" name="departure_date" value="' + dept_date_field.text().replace(" ", "T") + '" />');
	dest_field.html('<input type="text" name="destination" value="' + dest_field.text() + '" />');
	dest_date_field.html('<input type="datetime-local" name="arrival_date" value="' + dest_date_field.text().replace(" ", "T") + '" />');
}

function flight_adding() {
	$("#flight_manage #flight_add").hide();
	$("#flight_manage #flight_add_cancel").show();
	$("#flight_manage #flight_add_save").show();
	$("#flight_manage tfoot").show();
}

function flight_adding_reset() {
	$("#flight_manage #flight_add_cancel").hide();
	$("#flight_manage #flight_add_save").hide();
	$("#flight_manage #flight_add").show()
	$("#flight_manage tfoot").hide();
	$("#flight_manage tfoot input").val("");
}
var flight_now_page = 1;
var flight_total_page = 0;
var flight_sort_by = 'id';

function flight_goto_page(page) {
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
		$("#flight_manage #flight_page_control #flight_p_select").attr("placeholder", page + ' / ' + flight_total_page);

		$("#flight_manage tbody").empty();
		for(var plain in data.data) {
			$("#flight_manage tbody").append("<tr>" +
					"<td>" + data.data[plain].flight_number + "</td>" +
					"<td>" + data.data[plain].departure + "</td>" +
					"<td>" + data.data[plain].departure_date + "</td>" +
					"<td>" + data.data[plain].destination + "</td>" +
					"<td>" + data.data[plain].arrival_date + "</td>" +
					"</tr>");
		}
	}, 'json');
}

function flight_manage_onEnter() {
	flight_now_page = 1;
	flight_goto_page(1);
}

function reset_flight_manage() {
}

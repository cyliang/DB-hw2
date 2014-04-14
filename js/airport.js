var airport = new Object();
airport.div_id = "airport_manage";
airport.title = "機場管理";

airport.now_page = 1;
airport.total_page = 0;
airport.page_data;

airport.prepare = function() {
	$("#airport_manage #airport_page_control #airport_p_select").bind('input', function() {
		if($(this).val() != "" && $(this).val() != airport.now_page) {
			airport.goto_page($(this).val());
		}
	});

	this.add_dialog = $("#airport_manage #airport_add_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 400,
		height: 300,
		buttons: {
			"新增": function() {
				$(this).find("button").click();
			}, "取消": function() {
				$(this).dialog("close");
			}
		}
	});

	this.add_dialog.find('input[name="longitude"]').slidemoney({
		min: -180,
		max: 180,
		step: 0.000001
	});
	this.add_dialog.find('input[name="latitude"]').slidemoney({
		min: -90,
		max: 90,
		step: 0.000001
	});
	this.add_dialog.find("form").submit(function() {
		event.preventDefault();

		post('php/airport.php', $(this).serialize(), function(data, status) {
			airport.goto_page("last");
			airport.add_dialog.dialog("close");
		});
	});
}

airport.goto_page = function(page, callback) {
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
	
	post('php/airport.php', {
		funct: "list",
		page: page
	}, function(data, status) {
		airport.now_page = page;
		airport.total_page = data.page_count;
		airport.page_data = data.data;

		$("#airport_manage tbody").empty();
		for(var item in data.data) {
			$("#airport_manage tbody").append((item % 2 == 1 ? '<tr class="alt">' : "<tr>") +
					'<td class="plain_control">' + 
						'<a href="#" onClick="airport.editing(' + item + ')"><span class="icon-pen"></span></a>' + 
						'<a href="#" onClick="airport.remove(' + item + ')"><span class="icon-trash"></span></a></td>' +
					'<td>' + data.data[item].name + "</td>" +
					'<td>' + data.data[item].longitude + "</td>" +
					'<td>' + data.data[item].latitude + "</td>" +
					'<td></td>' + 
					"</tr>");
		}
		
		$("#airport_manage #airport_page_control #airport_p_select").attr("placeholder", page + ' / ' + airport.total_page)
									.val("");
		$("#airport_manage #airport_page_control #airport_p_list").empty();
		for(var i = 1; i <= airport.total_page; i++) {
			$("#airport_manage #airport_page_control #airport_p_list").append('<option val="' + i + '">' + i + '</option>');
		}
		
		if(airport.now_page <= 1) {
			$("#airport_manage #airport_page_control #airport_p_first").hide();
			$("#airport_manage #airport_page_control #airport_p_previous").hide();
		} else {
			$("#airport_manage #airport_page_control #airport_p_first").show();
			$("#airport_manage #airport_page_control #airport_p_previous").show();
		}
		if(airport.now_page >= airport.total_page) {
			$("#airport_manage #airport_page_control #airport_p_last").hide();
			$("#airport_manage #airport_page_control #airport_p_next").hide();
		} else {
			$("#airport_manage #airport_page_control #airport_p_last").show();
			$("#airport_manage #airport_page_control #airport_p_next").show();
		}
		
		if(callback) {
			callback();
		}
	});
}

airport.init = function() {
	this.now_page = 1;
	this.goto_page(1);
}

airport.adding = function() {
	this.add_dialog.find('input[type!="hidden"]').val("");
	this.add_dialog.dialog("open");
}

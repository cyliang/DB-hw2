var airport = new Object();
airport.div_id = "airport_manage";
airport.title = "機場管理";

airport.now_page = 1;
airport.total_page = 0;
airport.page_data;
airport.list = null;

airport.prepare = function() {
	$("#airport_manage #airport_page_control #airport_p_select").bind('input', function() {
		if($(this).val() != "" && $(this).val() != airport.now_page) {
			airport.goto_page($(this).val());
		}
	});

	this.add_dialog = $("#airport_manage #airport_add_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 650,
		buttons: {
			"檢視地圖": function() {
				airport.refresh_map();
			}, "確定": function() {
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
			airport.goto_page(airport.add_dialog.find('input[name="funct"]').val() == "add" ? "last" : "now");
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
					'<td class="airport_edit">' + 
						'<a href="#" onClick="airport.editing(' + item + ')"><span class="icon-pen"></span></a>' + 
						'<a href="#" onClick="airport.remove(' + item + ')"><span class="icon-trash"></span></a></td>' +
					'<td>' + data.data[item].id + "</td>" +
					'<td>' + data.data[item].name + "</td>" +
					'<td>' + data.data[item].longitude + "</td>" +
					'<td>' + data.data[item].latitude + "</td>" +
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
	this.add_dialog.dialog("option", "title", "新增機場");
	this.add_dialog.find('input[type!="hidden"]').val("");
	this.add_dialog.find('input[name="funct"]').val("add");
	this.add_dialog.find('.airport_map').hide();
	this.add_dialog.dialog("open");
}

airport.remove = function(row) {
	if(confirm("真的要刪除此機場嗎？\n機場名稱：" + this.page_data[row].name + 
				"\n經度：" + this.page_data[row].longitude + 
				"\n緯度：" + this.page_data[row].latitude)) {
		post('php/airport.php', {
			id: this.page_data[row].id,
			funct: "delete"
		}, function(data, status) {
			airport.goto_page("now");
		});
	}
}

airport.editing = function(row) {
	this.add_dialog.dialog("option", "title", "修改機場");
	this.add_dialog.find('input[name="id"]').val(this.page_data[row].id);
	this.add_dialog.find('input[name="name"]').val(this.page_data[row].name);
	this.add_dialog.find('input[name="longitude"]').val(this.page_data[row].longitude);
	this.add_dialog.find('input[name="latitude"]').val(this.page_data[row].latitude);
	this.add_dialog.find('input[name="funct"]').val("edit");
	this.refresh_map();
	this.add_dialog.dialog("open");
}

airport.refresh_map = function() {
	var longitude = this.add_dialog.find('input[name="longitude"]').val();
	var latitude = this.add_dialog.find('input[name="latitude"]').val();
	if(longitude != "" && longitude >= -180 && longitude <= 180 &&
		latitude != "" && latitude >= -90 && latitude <= 90) {
		var pos = latitude + ',' + longitude;

		this.add_dialog.find(".airport_map").attr("src", 
			"http://maps.googleapis.com/maps/api/staticmap?center=" + pos +
			"&zoom=12&size=300x300&sensor=false&markers=%7C" + pos
		).show();
	}
}

airport.refresh_list = function() {
	post("php/airport.php", {
		funct: "all"
	}, function(data, status) {
		airport.list = data.data;
		var dlist = $("datalist#airport_list").empty();

		for(var item in data.data) {
			dlist.append('<option value="' + data.data[item] + '">');
		}
	});
}

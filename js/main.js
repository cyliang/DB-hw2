var pages = {
	login_dialog: {
		div_id: "login_dialog",
		title: "使用者登入",
		reset: reset_login_dialog
	},
	welcome: {
		div_id: "welcome_page",
		title: "歡迎",
		reset: function() {}
	},
	regist_dialog: {
		div_id: "regist_dialog",
		title: "註冊新使用者",
		reset: reset_regist_dialog
	},
	home: {
		div_id: "home_page",
		title: "首頁",
		reset: function() {}
	}
};

var now_page = "welcome";

$(document).ready(function() {
	alert("欸");
	$("input").mouseenter(function() {
		$(this).focus();
	});

	prepare_login_dialog();
	prepare_regist_dialog();
	listen_login();
	$("#" + pages[now_page].div_id).slideDown();
});

function change_page(new_page) {
	$("#" + pages[now_page].div_id).slideUp(function() {
		pages[now_page].reset();
		now_page = new_page;
		$("#" + pages[new_page].div_id).slideDown();
	});
	
	$("h2").slideUp(function() {
		$("h2").text(pages[new_page].title);
		$("h2").slideDown();
	});
	
	$("title").text("航班管理系統 - " + pages[new_page].title);
}
var pages = {
	login_dialog: {
		div_id: "login_dialog",
		title: "使用者登入"
	},
	welcome: {
		div_id: "welcome_page",
		title: "歡迎"
	},
	regist_dialog: {
		div_id: "regist_dialog",
		title: "註冊新使用者"
	}
};

var now_page = "welcome";

$(document).ready(function() {
	$("input").hover(function() {
		$(this).focus();
	}, function() {
		$(this).change();
	});

	prepare_login_dialog();
	prepare_regist_dialog();
	$("#" + pages[now_page].div_id).slideDown();
});

function change_page(new_page) {
	$("#" + pages[now_page].div_id).slideUp(function() {
		$("#" + pages[new_page].div_id).slideDown();
	});
	
	$("h2").slideUp(function() {
		$("h2").text(pages[new_page].title);
		$("h2").slideDown();
	});
	
	$("title").text("航班管理系統 - " + pages[new_page].title);
	now_page = new_page;
}
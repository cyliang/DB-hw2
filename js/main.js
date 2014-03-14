var pages = {
	login_dialog: {
		div_id: "login_dialog",
		title: "使用者登入"
	},
	welcome: {
		div_id: "welcome_page",
		title: "歡迎"
	}
};

var now_page;

$(document).ready(function() {
	prepare_login_dialog();
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
var page = new Object();
page.pages = {
	login_dialog: login_dialog,
	welcome: {
		div_id: "welcome_page",
		title: "歡迎",
	},
	regist_dialog: regist_dialog,
	home: {
		div_id: "home_page",
		title: "首頁",
	}, 
	flight_manage: flight,
	users_manage: users_manage,
	uset_dialog: uset,
	connect_account: connect_FB,
	background: background
};

page.now_page = "welcome";

$(document).ready(function() {
	$("h1").click(function() {
		page.change_page(login == 'yes' ? 'home' : 'welcome');
	});

	$("#login_state").hover(function() {
		if(login == 'yes') {
			$("#user_info").fadeIn();
		}
	}, function() {
		$("#user_info").fadeOut();
	});

	$("footer").hover(function() {
		$("footer .foot_hover").slideDown();
	}, function() {
		$("footer .foot_hover").slideUp();
	});

	for(var obj in page.pages) {
		if(page.pages[obj].prepare) {
			page.pages[obj].prepare();
		}
	}

	listen_login();
	$("#" + page.pages[page.now_page].div_id).slideDown();
	$(document).tooltip({content: function() {
		var title = $(this).attr("placeholder") || "";
		return $("<a>").text(title).html();
	}, items: "[placeholder]:not([disabled])"
	});
});

page.change_page = function(new_page) {
	$("#" + this.pages[this.now_page].div_id).slideUp(function() {
		if(page.pages[page.now_page].reset) {
			page.pages[page.now_page].reset();
		}

		page.now_page = new_page;
		
		if(page.pages[new_page].init) {
			page.pages[new_page].init();
		}

		$("#" + page.pages[new_page].div_id).slideDown();
	});
	
	$("h2").slideUp(function() {
		$("h2").text(page.pages[new_page].title);
		$("h2").slideDown();
	});
	
	$("title").text("航班管理系統 - " + this.pages[new_page].title);
}

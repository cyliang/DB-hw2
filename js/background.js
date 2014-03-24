var now_background = 0;
var max_background;
var background_auto;

function prepare_background() {
	max_background = $(".bg img").length;
	change_background(0);
	auto_background(true);
}

function auto_background(set) {
	if(set) {
		$("footer #auto_bg").hide();
		$("footer #stop_bg").show();
		background_auto = setInterval(function() {
			change_background("next");
		}, 30000);
	} else {
		$("footer #stop_bg").hide();
		$("footer #auto_bg").show();
		clearTimeout(background_auto);
	}
}

function change_background(no) {
	if(no == "next") {
		no = (now_background + 1) % max_background;
	} else if(no == "prev") {
		no = now_background - 1;
		if(no < 0) {
			no = max_background - 1;
		}
	}
	console.log(no);
	$(".bg img:nth-of-type(" + (now_background + 1) + ")").fadeOut("slow");
	$(".bg img:nth-of-type(" + (no + 1) + ")").fadeIn("slow");
	now_background = no;
}
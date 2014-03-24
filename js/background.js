var now_background = 0;
var max_background;
var background_auto;

function prepare_background() {
	max_background = $(".bg img").length;
	change_background(0);
	background_auto = setInterval(function() {
		change_background("next");
	}, 30000);
}

function change_background(no) {
	if(no == "next") {
		no = (now_background + 1) % max_background;
	} else if(no == "prev") {
		no = now_background - 1;
		if(no < 0) {
			no = max_background;
		}
	}
	
	$(".bg img:nth-of-type(" + (now_background + 1) + ")").fadeOut("slow");
	$(".bg img:nth-of-type(" + (no + 1) + ")").fadeIn("slow");
	now_background = no;
}
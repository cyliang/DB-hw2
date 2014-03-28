var background = new Object();
background.now = 0;

background.prepare = function() {
	this.max = $(".bg img").length;
	this.change(0);
	this.set_auto(true);
}

background.set_auto = function(set) {
	if(set) {
		$("footer #auto_bg").hide();
		$("footer #stop_bg").show();
		this.auto = setInterval(function() {
			background.change("next");
		}, 30000);
	} else {
		$("footer #stop_bg").hide();
		$("footer #auto_bg").show();
		clearTimeout(this.auto);
	}
}

background.change = function(no) {
	if(no == "next") {
		no = (this.now + 1) % this.max;
	} else if(no == "prev") {
		no = this.now - 1;
		if(no < 0) {
			no = this.max - 1;
		}
	}
	$(".bg img:nth-of-type(" + (this.now + 1) + ")").fadeOut("slow");
	$(".bg img:nth-of-type(" + (no + 1) + ")").fadeIn("slow");
	this.now = no;
}

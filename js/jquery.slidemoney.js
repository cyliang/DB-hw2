$.widget("custom.slidemoney", {
	_create: function() {
		this._on(this.element, {
			focusin: "showSlider"
		});
	},
	showSlider: function(event) {
		this.slider = $("<div>", {})
			.insertAfter(this.element)
			.addClass("ui-slidemoney")
			.slider({
				min: 0,
				max: 999.99,
				step: 0.01,
				value: this.element.val()
			})
			.hide();

		this._on(this.slider, {
			focusout: "hideSlider",
			slide: "onSlide"
		});

		this._on(this.element, {
			focusout: "hideSlider",
			input: "eleChange"
		});
		this._off(this.element, "focusin");

		this.slider.fadeIn().position({
			of: this.element,
			my: "center top+10",
			at: "center bottom",
			collision: "fit"
		});
	},
	hideSlider: function(event) {
		if(!this.element.add(this.slider).add(this.slider.find("*")).is(event.relatedTarget)) {
			this.slider.fadeOut(function() {
				$(this).remove();
			});
			this._on(this.element, {
				focusin: "showSlider"
			});
			this._off(this.element, "input focusout");
		}
	},
	eleChange: function(event) {
		this.slider.slider("value", this.element.val());
	},
	onSlide: function(event, ui) {
		this.element.val(ui.value);
	},
	_destroy: function() {
		this._off(this.element, "focusin");
	}
});

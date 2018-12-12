window.onload = function () {
	initialize();
	run();
}

var calculator = {
	amount: 0,
	terms: 0,
	rate: 0
};

var slider,
	slider_range,
	slider_value;

function initialize () {

		slider       = document.getElementsByClassName('slider'),
		slider_range = document.getElementsByClassName('slider-range'),
		slider_value = document.getElementsByClassName('slider-value');

		for (var i = 0; i < slider_range.length; i++)
		{
			var button = document.createElement('div');
				button.classList.add('slider-button');

			var slider_path = document.createElement('div');
				slider_path.classList.add('slider-path');

				slider_range[i].append(button);
				slider_range[i].append(slider_path);

			var value = parseInt(slider[i].getAttribute('min')),
				prefix = slider[i].getAttribute('prefix'),
				postfix = slider[i].getAttribute('postfix');

				slider_value[i].innerText = covert_value(value, prefix, postfix);

				/* defalut values */
				calculator[slider[i].id] = parseInt(slider[i].getAttribute('min'));
		}

		calculate();

}

function run () {

	var dragging      = false,
		draggable     = null,
		button_offset = 0,

		slider,
		slider_path,
		slider_value,
		prefix,
		postfix,
		max = 0,
		min = 0,
		step = 1;

	for (var i = 0; i < slider_range.length; i++)
	{	
		var range_width = slider_range[i].offsetWidth,
			range_left  = slider_range[i].offsetLeft,
			range_right = range_left + range_width;

		var button = document.getElementsByClassName('slider-button'),

			button_width   = button[i].offsetWidth,
			right_boundary = range_width - button_width;


			button[i].addEventListener('mousedown', function(e) {
				dragging  = true,
				draggable = this;

				slider		 = draggable.parentNode.parentNode,
				slider_path  = draggable.parentNode.childNodes[1],
				slider_value = slider.childNodes[3],
				prefix		 = slider.getAttribute('prefix'),
				postfix		 = slider.getAttribute('postfix'),
				max     	 = parseInt(slider.getAttribute('max')),
				min			 = parseInt(slider.getAttribute('min')),
				step		 = parseInt(slider.getAttribute('step'));

				button_offset = e.clientX - draggable.offsetLeft;
			});

			window.addEventListener('mouseup', function(e) {
				dragging  = false,
				draggable = null;
			});

			window.addEventListener('mousemove', function(e) {

				if (dragging) {

					e.preventDefault();

					var range = e.clientX - range_left - button_offset + button_width;

					if (range < 0) {
						range = 0;
					} else if (range > right_boundary) {
						range = right_boundary;
					}

					var percent = (max - min) / 540,
						value   = (percent * range) + min,
						value = Math.round(value / step) * step;
 
					var slider_path_range = range + button_width / 2;

					draggable.style.left    = range + "px";
					slider_path.style.width = slider_path_range + "px";
					slider_value.innerText  = covert_value(value, prefix, postfix);

					/* calculate */

					calculator[slider.id] = value;
					calculate();
				}

			});
	}

}

function calculate () {
	var amount = calculator.amount,
		terms  = calculator.terms,
		rate   = calculator.rate;

	for (var i = 0; i < terms; i++) {
		amount += amount * (rate / 100);
	}

	document.getElementById('payout').innerText = covert_value(amount, '$');
}

function covert_value (value, prefix = '', postfix = '') {
	return prefix + parseInt(value).toFixed().replace(/\d(?=(\d{3})+$)/g, '$&,') + postfix;
}
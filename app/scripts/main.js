// Main
$(document).ready(function(){
	// Choice prices
	var prices = $('.values-item');

	prices.on('click', function(){
		prices.removeClass('active');
		$(this).addClass('active');
	});

	// Count textarea characters
	$('#message').keyup(function(){
		var that = $(this),
			ch = that.val().length,
			maxl = that.attr('maxlength'),
			out = $('.counter');

		out.text( maxl - ch );

		// for old browsers
		if ( ch > maxl ) {
			that.val( that.val().substring(0, maxl) );
		};
	});

	// Form validator
	var form = $('#form');

	function validateEmail(email) {
		var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regex.test(email);
	}

	$('.required').each(function(){
		var that = $(this),
			parent = that.parent(),
			type = that.attr('type');

		that.focus(function(){
			parent.removeClass('error');
		});

		function validate() {
			if ( type == 'email' ) {

				if ( validateEmail( that.val() ) ) {
					parent.removeClass('error');
					return;
				} else {
					parent.addClass('error');
					$('body').animate({
						scrollTop: form.offset().top
					},500);
					return false;
				}

			} else if( type == 'text' ) {

				if ( that.val() != '' ) {
					parent.removeClass('error');
					return;
				} else {
					parent.addClass('error');
					$('body').animate({
						scrollTop: form.offset().top
					},500);
					return false;
				}
			}
		}

		form.on('submit', validate);
	});

	// Calendar
	var changeDate = $('.date'),
		changeDay = changeDate.find('.day'),
		changeMonth = changeDate.find('.month'),
		changeYear = changeDate.find('.year');

	$('#customCalendar').fullCalendar({
		header: {
			left: 'prev',
			center: 'title',
			right: 'next'
		},
		dayNamesShort: ['D','S','T','Q','Q','S','S'],
		contentHeight: 235,
		lang: 'pt-br',
		dayClick: function(e){
			var that = $(this),
				fullDate = that.attr('data-date').split('-'),
				currentYear = fullDate[0],
				currentMonth = fullDate[1],
				currentDay = fullDate[2],
				day = $('.fc-content-skeleton').find('.fc-day-number');

			switch(currentMonth) {
				case '01':
					currentMonth = 'Janeiro';
					break;
				case '02':
					currentMonth = 'Fevereiro';
					break;
				case '03':
					currentMonth = 'Março';
					break;
				case '04':
					currentMonth = 'Abril';
					break;
				case '05':
					currentMonth = 'Maio';
					break;
				case '06':
					currentMonth = 'Junho';
					break;
				case '07':
					currentMonth = 'Julho';
					break;
				case '08':
					currentMonth = 'Agosto';
					break;
				case '09':
					currentMonth = 'Setembro';
					break;
				case '10':
					currentMonth = 'Outubro';
					break;
				case '11':
					currentMonth = 'Novembro';
					break;
				case '12':
					currentMonth = 'Dezembro';
					break;
			}

			// Active visual current day
			day.on('click', function(){
				changeDate.css('visibility', 'visible');
				day.removeClass('active');
				$(this).addClass('active');
			});

			changeDay.text(currentDay);
			changeMonth.text(currentMonth);
			changeYear.text(currentYear);
		}
	});

	
})

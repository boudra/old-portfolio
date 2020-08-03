(function($) {

    var resetFormResultTimeout = null;

    $('a[href*=#]').click(function(e) {    

        var position = 0, speed = 500;   
        var $target = $(this.hash);

        e.preventDefault();

        if($target.length !== 0)
            position = $target.offset().top;

        if($(this).attr('data-speed'))
            speed = parseInt($(this).attr('data-speed'));

        $('html,body').stop().animate({scrollTop: position}, speed);

        return false;
    });
    
    function resetFormResult() {

	var $this = $('#contact-form'),
	$btn = $this.find('.btn'),
	$msg = $this.find('.msg'),
	$btnMsg = $btn.find('span'),
	$icon = $btn.find('i.fa');

	$btn.removeClass('ok error');
	$btnMsg.html('send message');

	$icon.removeClass();
	$icon.addClass('fa fa-paper-plane');

	$msg.slideUp(200);

    }

    function appear() {

        var wpos = $(window).scrollTop(),
        height = $(window).height(),
            $header = $('.intro'),
            $title = $header.find('h1'),
	    offset = (1.0 - (wpos / height));

	if(offset > 0) {
	    $header.show();
	    $header.css('height', (offset * 100) + '%');
	    $title.css('opacity', offset);
	} else {
	    $header.hide();
	}

        $('[data-appear]:not(.animated)').each(function() {

            var $this = $(this),
		pos = $this.offset().top,
		appearClass = $this.attr('data-appear');

            if(Math.abs(pos - wpos) < height * 0.85)
	    {
                $this.addClass('animated ' + appearClass);
		setTimeout(function() {
		    $this.removeClass(appearClass);
		}, 1000);
	    }

        });

    }

    $('.sections').css('transform', 'translateY(' + $(window).height() + 'px)');

    $(window).on('resize', function() {
	$('.sections').css('transform', 'translateY(' + $(window).height() + 'px)');
    });

    $(window).on('scroll', appear);
    appear();

    $('#contact-form').on('submit', function(e) {

	e.preventDefault();

	var $this = $(this),
	$btn = $this.find('.btn'),
	$msg = $this.find('.msg'),
	$btnMsg = $btn.find('span'),
	$icon = $btn.find('i.fa');

	$btnMsg.html('sending message ...');
	$btn.removeClass('ok error');

	$icon.removeClass();
	$icon.addClass('fa fa-gear fa-spin');

	var data = $this.serializeArray();

        $this.find(':input').prop('disabled', true);
	
	setTimeout(function() {

	    $.ajax({

		url: 'contact.php',
		type: 'POST',
		data: data

	    }).done(function(r) {

		r = JSON.parse(r);
		console.log(r);
		$btn.prop('disabled', true);
		$btn.addClass('ok');
		$icon.removeClass();
		$icon.addClass('fa fa-check');
		$msg.removeClass('ok error');
		$msg.addClass('ok');
		$msg.html(r.msg);
		$msg.slideDown(200);
		$btnMsg.html('message sent');
		$this[0].reset();

	    }).fail(function(xhr) {

		var r = JSON.parse(xhr.responseText);
		$btn.prop('disabled', true);
		$btn.addClass('error');
		$icon.removeClass();
		$icon.addClass('fa fa-times');
		$msg.removeClass('ok error');
		$msg.addClass('error');
		$msg.html(r.msg);
		$msg.slideDown(200);
		$btnMsg.html('an error occurred');

	    }).always(function() {

		$this.find(':input:disabled').prop('disabled', false);

		clearTimeout(resetFormResultTimeout);
		setTimeout(resetFormResult, 5000);

	    });

	}, 500);

	setTimeout(function() {

	}, 2000);

    });


})(jQuery);

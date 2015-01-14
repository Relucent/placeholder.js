$(function() {
	if (('placeholder' in document.createElement('input'))) {
		return;//
	}
	var idSeed = 0, idCache = {}, timerId = 0, loop = function() {
		clearTimeout(timerId);
		$('[placeholder]').each(function() {
			var $that = $(this), spanId = $that.data('placeholder-span-id'), $placeholder = (!!spanId) ? $('#' + spanId) : (function() {
				$that.data('placeholder-span-id', (spanId = 'placeholder-span-' + (idSeed++)));
				return $('<span id="' + spanId + '" class="placeholder"></span>').hide().appendTo(document.body).on('click', function() {
					$placeholder.hide();
					setTimeout(function() {
						$that[0].focus();
						$that.click();
					}, 31);
				});
			})();
			if ($that.data('placeholder-show') !== false && $that.is(':visible') && $that.val() == '') {
				var width = $that.outerWidth();
				var height = $that.outerHeight();
				var fontSize = $that.css('font-size');
				var fontFamily = $that.css('font-family');
				var paddingLeft = parseInt($that.css('padding-left'), 10) + 3;
				var word = $that.attr('placeholder') || 'Please enter...';
				var offset = $that.offset();
				$that.is('input') && $placeholder.css({性
					lineHeight : height + 'px'
				});
				$placeholder.css({
					position : 'absolute',
					top : offset.top,
					left : offset.left,
					width : (width - paddingLeft) + 'px',
					height : height + 'px',
					fontSize : fontSize,
					paddingLeft : paddingLeft + 'px',
					fontFamily : fontFamily
				}).text(word).show();
			} else {
				$placeholder.hide();
			}
			idCache[spanId] = timerId;
		});
		for (var id in idCache) {
			if (idCache[id] !== timerId) {
				$('#' + id).remove();
				delete idCache[id];
			}
		}
		timerId = setTimeout(loop, 20);
	};
	$('[placeholder]').live('click', function() {
		$(this).data('placeholder-show', false);
	}).on('blur', function() {
		$(this).data('placeholder-show', true);
	});
	loop();
	$(window).unload(function() {
		clearTimeout(timerId);
	});
});

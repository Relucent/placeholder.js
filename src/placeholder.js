/**
 * 使旧浏览器(主要是IE6-IE9)支持input中的placeholder属性.
 * @author YaoYiLang
 * @version 1.01
 */
$(function() {
	if (('placeholder' in document.createElement('input'))) {
		return;// 浏览器已经支持placeholder不需要额外做处理
	}
	var idSeed = 0, idCache = {}, timerId = 0, selector = 'input[placeholder],textarea[placeholder]', animateSpan = function($that) {
		var spanId = $that.data('placeholder-span-id'), $placeholder = (!!spanId) ? $('#' + spanId) : (function() {
			$that.data('placeholder-span-id', (spanId = 'placeholder-span-' + (idSeed++)));
			return $placeholder = $('<span id="' + spanId + '" style="position:absolute;color:#888888;overflow:hidden;background:none;"></span>').hide().appendTo($that.parent()).on('click', function() {
				$placeholder.hide();
				setTimeout(function() {
					$that[0].focus();
					$that.click();// 盖住后无法触发input的click事件，需要模拟点击下
				}, 31);
			});
		})();
		if (!$that.is(':focus') && $that.is(':visible') && $that.val() === '') {
			var width = $that.outerWidth();
			var height = $that.outerHeight();
			var fontSize = $that.css('font-size');
			var fontFamily = $that.css('font-family');
			var paddingLeft = parseInt($that.css('padding-left'), 10) + 3;
			var word = $that.attr('placeholder') || 'Please enter...';
			var position = $that.position();
			$that.is('input') && $placeholder.css({ // input需要加line-heihgt属性
				lineHeight : height + 'px'
			});

			$placeholder.css({
				top : position.top,
				left : position.left,
				width : (width - paddingLeft) + 'px',
				height : height + 'px',
				fontSize : fontSize,
				paddingLeft : paddingLeft + 'px',
				fontFamily : fontFamily,
				zIndex : ($that.css('zIndex') | 0) + 1000
			});
			if ($placeholder.text() !== word) {
				$placeholder.text(word);
			}
			$placeholder.show();
		} else {
			$placeholder.hide();
		}
		return spanId;
	}, loop = function() {
		clearTimeout(timerId);
		$(selector).each(function() {
			idCache[animateSpan($(this))] = timerId;
		});
		for ( var id in idCache) {
			if (idCache[id] !== timerId) {
				$('#' + id).remove();
				delete idCache[id];
			}
		}
		timerId = setTimeout(loop, 200);
	};
	$(document).on('focus', selector, function() {
		animateSpan($(this));
	}).on('blur', selector, function() {
		animateSpan($(this));
	});
	loop();
	$(window).unload(function() {
		clearTimeout(timerId);
	});
});

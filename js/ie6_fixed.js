/*
author : laoshu133
update : 2011.08.20
www.laoshu133.com
--fix IE6 不能position:fixed的BUG
--最好不要设置背景图片，设置背景图片后，背景将无法滚动
--如果设置为右对齐， 请固定宽度， 下对齐，请固定高度
*/
;(function(window, doc){
	ds.extend({
		setFixed : function(elems){
			var 
			body = doc.body,
			isIE6 = this.ieVer(6),
			docElStr = '(document.documentElement || document.body)',
			el, style, pos;
			if(elems && elems.nodeType === 1){
				elems = [elems];
			}
			if(isIE6 && this.css(body, 'backgroundAttachment') !== 'fixed'){
				this.css(body, 'backgroundAttachment', 'fixed');
				this.css(body, 'backgroundImage') === 'none' && this.css(body, 'backgroundImage', 'url(about:blank)');
			}
			for(var i=0,len=elems.length; i<len; i++){
				el = this.$d(elems[i]);
				style = el.style;
				if(isIE6){
					style.position = 'absolute';
					pos = this.getPosition(el);
					style.setExpression('left', 'eval("' + docElStr + '.scrollLeft + ' + pos.left + '") + "px"');
					style.setExpression('top', 'eval("' + docElStr + '.scrollTop + ' + 0 + '") + "px"');
				}
				else{
					style.position = 'fixed';
				}
			}
			return this;
		}
	});
})(this, this.document);

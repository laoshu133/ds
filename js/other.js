/*
author : laoshu133
update : 2011.05.20
www.laoshu133.com
--other模块
--1.保存网页 ie only
*/
;(function(window, undefined){
	//other
	ds.extend({
		saveHTML : function(name, html){
			var win = window.open('', '', 'left=160, top=200, width=10, height=10'), docEl;
			try{
				docEl = win.document;
				docEl.open('text/html', 'replace');
				docEl.write(html);
				docEl.execCommand("saveas", "", name + ".html");
				docEl = null;
				win.close();
			}
			catch(ex){
				win.blur();
				win.close();
				alert('网页保存失败，可能您的浏览器不支持此操作');
			}
			win = null;
		}
	});
})(window);

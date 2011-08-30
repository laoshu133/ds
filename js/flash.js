/*
author : laoshu133
update : 2011.05.20
www.laoshu133.com
--flash模块
*/
;(function(window, undefined){
	var flashVer = (function(ds){
		var ver = 0, plg = navigator.plugins, obj = null, support = false,
		str='Shockwave Flash', ieStr = 'ShockwaveFlash.ShockwaveFlash.7';
		if(plg && plg[str]){
			obj = plg[str].description.split(' ');
			ver = parseInt(obj[2], 10);
		}
		else{
			try{
				obj = new ActiveXObject(ieStr);
				ver = parseInt(obj.GetVariable("$version").split(' ')[1], 10);
			}catch(_){}
		}
		return ver || 0;
	})();
	ds.extend({
		supportFlash : flashVer>0,
		flashVer : flashVer,
		getFlashHTML : function(url, width, height, id, ops){
			var opsStr = '', html,
			httpPri = /^https/.test(location.href) ? 'http://' : 'https://',
			_ops = {
				wmode : 'transparent',
				bgcolor : '#ffffff',
				allowFullScreen : 'false',
				allowScriptAccess : 'always',
				loop : 'false',
				menu : 'false',
				quality : 'best'
			};
			for(var k in ops){
				_ops[k] = ops[k];
			}
			for(var k in _ops){
				opsStr += isIE ? ('<param name="' + k + '" value="' + _ops[k] + '" />') : (k + '="' + _ops[k] + '" ');
			}
			id = id || 'ds_flash_' + getGuid();
			//默认透明背景
			html = isIE ? //<param name="flashvars" value="' + flashvars + '"/>
				'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + httpPri + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + width + '" height="' + height + '" id="' + id + '"><param name="movie" value="' + url + '" />' + opsStr + '</object>' :
				'<embed id="' + id + '" src="' + url + '" width="' + width + '" height="' + height + '" name="' + id + '"  type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" ' + opsStr + ' />';
			return html;
		}
	});
})(window);

//动画 2011.08.07
(function(window,doc){
	//animate
	var 
	docEl = doc.documentElement,
	$d = ds.$d,
	cssAnimateSupport = false,
	cssPris = ['webkit', 'Moz', 'o', ''],
	cssDurStr = '';
	for(var i = 0; i < cssPris.length; i++){
		cssDurStr = cssPris[i] + 'TransitionDuration';
		if(cssDurStr in docEl.style){
			cssAnimateSupport = true;
			break;
		}
	}
	var 
	uuid = 'ds_animate_uuid',
	getInt = function(num){ return parseInt(num, 10) || 0;},
	isEmpty = function(obj){
		var undf;
		for(undf in obj){
			return false;
		}
		return true;
	},
	animate = cssAnimateSupport ? function(el, ops, duration){
		var oldDur = ds.css(el, cssDurStr);
		ops = ops || {};
		duration = isFinite(duration) ? duration + 'ms' : (duration || '200ms');
		ds.css(el, cssDurStr, duration).css(el, ops);
		//ds.css(el, cssDurStr, oldDur);
	} : function(el, ops, duration){
		//window.console && console.log((el.id || el.nodeName) + ' animate fired, duration = ' + duration);
		if(isEmpty(ops)) return;
		//只支持简单动画
		var val,
		//算法
		ease = function(t){return (t *= 2) < 1 ? .5 * t * t : .5 * (1 - (--t) * (t - 2));},
		parCount = 0,
		parms = {},
		oldParms = {},
		parRanges = {},
		tmp, _t = null;
		duration = getInt(duration);
		for(var name in ops){
			tmp = ops[name];
			if(isFinite(parseInt(tmp))){
				parCount++;
				tmp = getInt(tmp);
				parms[name] = tmp;
				oldParms[name] = getInt(ds.css(el, name));
				parRanges[name] = tmp - oldParms[name];
			}
		}
		
		var 
		count = 0,
		abs = Math.abs,
		fxDone = function(name){
			if(typeof name === 'string' && parms[name]){
				ds.css(el, name, parms[name] + 'px');
				delete parms[name];
				count++;
			}
			else{
				ds.css(el, parms);
				parms = {};
			}
		},
		sTime = new Date().getTime(),
		fx = function(){
			var 
			tmp = 0,
			tMap = new Date().getTime() - sTime;
			//console.log(tMap + ' +++ ' + duration + ', ' + parCount + ' +++ ' + count);
			if(tMap >= duration || parCount <= count){
				return fxDone();
			}
			for(var k in parms){
				tmp = parRanges[k] * ease(tMap / duration);
				if(abs(tmp) < abs(parRanges[k])){
					ds.css(el, k, (oldParms[k] + tmp) + 'px');
				}
				else{
					fxDone(k);
				}
			}
			_t = setTimeout(fx, 16);
		};
		fx();
	};
	ds.animate = animate;
})(window, window.document);
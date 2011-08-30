/*
author : laoshu133
update : 2011.08.27
www.laoshu133.com
*/
//slider obj
(function(window){
	var 
	doc = window.document,
	$d = ds.$d,
	slider = function(ops){
		var _ops = this._ops;
		ds.mix(ops, _ops);
		this.init(ops);
		this.autoPlay();
	};
	slider.prototype = {
		constructor : slider,
		_ops : {
			shell : doc.body,
			navEl : void 0,
			animateEl : null,
			direction : 'left',
			itemNodeName : 'li',
			trigger : 'mouseenter',
			unitSize : 500,
			duration : 400,
			delay : 4200,
			auto : true,
			isAnimate : true
		},
		init : function(ops){
			var panel = $d(ops.shell),
			fxEl = $d(ops.animateEl || ds.$D('ul', panel)[0]),
			hasNav = ops.navEl !== null,
			addNav = typeof ops.navEl === 'string' && !$d(ops.navEl),
			navEl = addNav ? ds.createEl('div', {id : ops.navEl}) : $d(ops.navEl),
			items = [], nodeName = ops.itemNodeName.toLowerCase(),
			tmpItems = fxEl.childNodes;
			for(var i = 0,j = 0, len=tmpItems.length; i<len; i++){
				if(tmpItems[i].nodeType === 1 && tmpItems[i].nodeName.toLowerCase() === nodeName){
					items[j++] = tmpItems[i];
				}
			}
			//动画属性
			this.prevInx = 0;
			this.dirIsTop = (ops.direction === 'top');
			this.fxEl = fxEl;
			//部分结构
			this.navEl = navEl;
			this.navLinks = addNav ? [] : ds.$D('a', navEl);
			//对象属性
			this.addNav = addNav,
			this.hasNav = hasNav,
			this.items = items;
			this.itemCount = items.length;
			this.ops = ops;
			this.panel = panel;
			this.layout();
			this.bind();
		},
		layout : function(){
			var ops = this.ops,
			isTop = this.dirIsTop,
			unitName = isTop ? 'height' : 'width',
			items = this.items,
			navEl = this.navEl,
			frag = doc.createDocumentFragment(),
			navLinks = this.navLinks,
			size = ops.unitSize,
			len = items.length,
			el, i = 0;
			if(this.addNav){
				navEl.className = ops.navEl;
				for(; i<len; i++){
					el = ds.createEl('a', {href:'#', hideFocus:true});
					el.innerHTML = (i + 1);
					navLinks.push(el);
					frag.appendChild(el);
					ds.css(items[i], unitName, size + 'px');
				}
				navEl.appendChild(frag);
				this.panel.appendChild(navEl);
			}
			ds.css(this.fxEl, unitName, (len * size) + 'px');
			if(this.hasNav) navLinks[0].className = 'hover';
		},
		bind : function(){
			var el,
			self = this,
			panel = this.panel,
			ops = this.ops,
			links = this.navLinks,
			play = function(inx){
				if(inx !== self.prevInx){
					self.play(inx);
				}
			},
			isNodeEl = function(el){
				return !!(el && el.nodeType === 1);
			};
			if(this.hasNav){
				for(var i = 0, len = this.itemCount; i<len; i++){
					el = links[i];
					ds.bind(el, 'click', (function(inx){
						return function(e){
							play(inx);
							e.preventDefault();
						}
					})(i));
					ds.bind(el, ops.trigger, (function(inx){
						return function(e){
							play(inx);
						}
					})(i));
				}
			}
			ds.hover(panel, function(){
				self.stopAuto();
			}, function(){
				self.autoPlay();
			});
		},
		play : function(inx){
			var 
			ops = this.ops,
			links = this.navLinks,
			prevInx = this.prevInx,
			size = ops.unitSize,
			aniObj = {},
			leftSize = 0;
			inx = isFinite(inx) ? inx : (prevInx + 1) % this.itemCount;
			leftSize = -size * inx;
			if(this.hasNav){
				links[prevInx].className = '';
				links[inx].className = 'hover';
			}
			aniObj[this.dirIsTop ? 'marginTop' : 'marginLeft'] = leftSize + 'px';
			ds.stop(this.fxEl).animate(this.fxEl, aniObj, ops.isAnimate ? ops.duration : 0);
			this.prevInx = inx;
		},
		autoPlay : function(){
			var 
			self = this,
			delay = this.ops.delay,
			ansyLoop = function(){
				self.play();
				self._timer = setTimeout(function(){
					ansyLoop();
				}, delay);
			};
			if(this.ops.auto){
				this.autoPlaying = true;
				this._timer = setTimeout(function(){ansyLoop();}, delay);
			}
		},
		stopAuto : function(){
			if(this.ops.auto){
				this.autoPlaying = false;
				window.clearTimeout(this._timer);
			}
		}
	}
	window.Slider = slider;
})(window);
//slider2 提供另外一种滑动效果
(function(window, doc){
	var $d = ds.$d,
	noAnimate = (function(){
		var 
		docEl = doc.documentElement,
		cssPris = ['webkit', 'Moz', 'o', ''],
		suport = false,
		aniCssStr;
		for(var i=0; i<cssPris.length; i++){
			aniCssStr = cssPris[i] + 'TransitionDuration';
			if(aniCssStr in docEl.style){
				suport = true;
				break;
			}
		}
		return function(el){
			if(suport){
				ds.css(el, aniCssStr, '0ms');
			}
		};
	})(),
	slider2 = function(ops){
		ds.mix(ops, this._ops);
		this.init(ops);
		this.autoPlay();
	};
	slider2.prototype = {
		constructor : slider2,
		_ops : {
			shell : doc.body,
			itemNodeName : 'ul',
			direction : 'left',
			unitSize : 500,
			duration : 400,
			delay : 3600,
			auto : true
		},
		init : function(ops){
			var 
			panel = $d(ops.shell),
			tmpNodes = panel.childNodes,
			el, nodeName = ops.itemNodeName.toLowerCase(),
			i = 0, len = tmpNodes.length,
			items = [];
			for(; i < len; i++){
				el = tmpNodes[i];
				if(el.nodeType === 1 && el.nodeName.toLowerCase() === nodeName){
					items.push(el);
				}
			}
			tmpNodes = null;
			
			this.items = items;
			this.itemCount = this.prevInx = items.length;
			this.panel = panel;
			this.isTop = ops.direction === 'top';
			this.ops = ops;
			if(this.itemCount > 1){
				this.layout();
				this.bind();
			}
		},
		layout : function(){
			var 
			ops = this.ops,
			items = this.items,
			len = this.itemCount,
			panel = this.panel,
			frag = doc.createDocumentFragment(),
			size = ops.unitSize * len, el;
			for(var i = 0; i < len; i++){
				el = items[i].cloneNode(true);
				//items.push(el);
				frag.appendChild(el);
			}
			panel.appendChild(frag);
			ds.css(panel, this.isTop ? 'height' : 'width', (2 * size) + 'px');
			this.reset(true);
		},
		bind : function(){
			var 
			self = this,
			panel = this.panel,
			isNodeEl = function(el){
				return !!(el && el.nodeType === 1);
			};
			ds.bind(panel, 'mouseover', function(e){
				self.stopAuto();
			})
			.bind(panel, 'mouseout', function(e){
				var tar = e.relatedTarget;
				if(!self.autoPlaying && isNodeEl(tar) && !ds.contains(this, tar)){
					self.autoPlay();
				}
			});
		},
		play : function(dir){
			//只有一项时不进行动画
			if(this.itemCount <= 1) return;
			var 
			ops = this.ops,
			len = this.itemCount,
			maxLen = 2 * len,
			prevInx = this.prevInx,
			inx = isNaN(dir) || dir > 0 ? (prevInx + 1) % maxLen : prevInx - 1,
			initReset = inx < 0;
			if(initReset || (!inx && prevInx === maxLen - 1)){
				this.reset(initReset);
				inx = initReset ? len - 1 : len;
			}
			//动画开始
			var aniObj = {};
			aniObj[this.isTop ? 'marginTop' : 'marginLeft'] = (-inx * ops.unitSize) + 'px';
			ds.animate(this.panel, aniObj, ops.duration);
			this.prevInx = inx;
		},
		reset : function(init){
			var 
			size = this.ops.unitSize,
			len = this.itemCount,
			name = this.isTop ? 'marginTop' : 'marginLeft',
			val = -size * (init ? len : len - 1);
			noAnimate(this.panel);
			ds.css(this.panel, name, val + 'px');
		},
		autoPlay : function(){
			if(this.itemCount <= 1) return;
			var 
			self = this,
			delay = this.ops.delay,
			ansyLoop = function(){
				self.play();
				self._timer = setTimeout(function(){
					ansyLoop();
				}, delay);
			};
			if(this.ops.auto){
				this.autoPlaying = true;
				this._timer = setTimeout(function(){ansyLoop();}, delay);
			}
		},
		stopAuto : function(){
			if(this.ops.auto){
				this.autoPlaying = false;
				window.clearTimeout(this._timer);
			}
		}
	};
	window.Slider2 = slider2;
})(window, window.document);
//fadeList
(function(window, doc){
	var 
	$d = ds.$d,
	noAnimate = (function(){
		var 
		docEl = doc.documentElement,
		cssPris = ['webkit', 'Moz', 'o', ''],
		suport = false,
		aniCssStr;
		for(var i=0; i<cssPris.length; i++){
			if((aniCssStr = cssPris[i] + 'TransitionDuration') in docEl.style){
				suport = true;
				break;
			}
		}
		return function(el){
			if(suport) ds.css(el, aniCssStr, '0ms');
			return el;
		};
	})(),
	guid = 0,
	fade = function(ops){
		ds.mix(ops, this._ops);
		this.init(ops);
		this.autoPlay();
	};
	fade.prototype = {
		constructor : fade,
		_ops : {
			shell : doc.body,
			navId : null,
			itemNodeName : 'li',
			trigger : 'click',
			auto : true,
			isAnimate : true
		},
		init : function(ops){
			var 
			panel = $d(ops.shell),
			items = ds.$D(ops.itemNodeName, panel);
			
			this.guid = guid++;
			this.panel = panel;
			this.items = items;
			this.itemCount = items.length;
			this.navLinks = [];
			this.mask = ds.createEl('a', {id:'ds_mask_' + guid});
			this.prevInx = 0;
			this.ops = ops;
			this.layout();
			this.bind();
		},
		getItemLink : function(inx){
			var el = this.items[inx], aLink, ret = {href : '#'};
			if(!el || el.nodeType !== 1){ return ret;}
			aLink = el.nodeName.toUpperCase() === 'A' ? el : ds.$D('a', this.panel)[0];
			return aLink ? {href:aLink.href ? aLink.href : '#', target : aLink.target} : ret;
		},
		layout : function(){
			var 
			ops = this.ops,
			len = this.items.length,
			id = typeof ops.navId === 'string' ? ops.navId : 'ds_fadelist_' + this.guid,
			items = this.items,
			links = this.navLinks,
			panel = this.panel,
			frag = doc.createDocumentFragment(),
			nav = ds.createEl('div', {id : id, className : id}),
			mask = this.mask,
			WH = ds.getWH(panel),
			maskCss = {
				backgroundColor : '#efefef',
				display : 'block',
				height : WH.height + 'px',
				width : WH.width + 'px',
				left : 0,
				top : 0,
				position : 'absolute',
				zIndex : len + 2,
				opacity : 0
			};
			for(var i = 0; i < len; i++){
				links[i] = ds.createEl('a', {href : '#'});
				links[i].innerHTML = i + 1;
				frag.appendChild(links[i]);
				ds.css(items[i], 'zIndex', len - i);
			}
			links[0].className = 'active';
			ds.attr(mask, this.getItemLink(0)).css(mask, maskCss);
			ds.css(nav, 'zIndex', len + 3);
			nav.appendChild(frag);
			panel.appendChild(mask);
			panel.appendChild(nav);
		},
		bind : function(){
			var 
			self = this,
			ops = this.ops,
			panel = this.panel,
			links = this.navLinks,
			len = this.itemCount,
			isNodeEl = function(el){
				return !!(el && el.nodeType === 1);
			},
			proxyHandler = function(inx){
				return function(e){
					//if(slef.prevInx !== inx){
						self.play(inx);
					//}
					e.preventDefault();
				};
			};
			ds.bind(panel, 'mouseover', function(){
				self.stopAuto();
			})
			.bind(panel, 'mouseout', function(e){
				var tar = e.relatedTarget;
				if(!self.autoPlaying && isNodeEl(tar) && !ds.contains(this, tar)){
					self.autoPlay();
				}
			});
			for(var i = 0; i < len; i++){
				ds.bind(links[i], ops.trigger, proxyHandler(i));
			}
		},
		play : function(inx){
			var 
			ops = this.ops,
			len = this.itemCount,
			items = this.items,
			links = this.navLinks,
			prevInx = this.prevInx,
			mask = this.mask
			;
			inx = (isFinite(inx) ? inx : prevInx + 1) % len;
			ds.css(items[prevInx], 'zIndex', len).css(items[inx], 'zIndex', len + 1);
			ds.attr(links[prevInx], 'className', '').attr(links[inx], 'className', 'active');
			if(ops.isAnimate){
				ds.stop(mask).css(mask, 'opacity', 1);
				ds.animate(mask, {opacity : 0}, ops.duration);
			}
			this.prevInx = inx;
		},
		autoPlay : function(){
			if(this.itemCount <= 1) return;
			var 
			self = this,
			delay = this.ops.delay,
			ansyLoop = function(){
				self.play();
				self._timer = setTimeout(function(){
					ansyLoop();
				}, delay);
			};
			if(this.ops.auto){
				this.autoPlaying = true;
				this._timer = setTimeout(function(){ansyLoop();}, delay);
			}
		},
		stopAuto : function(){
			if(this.ops.auto){
				this.autoPlaying = false;
				window.clearTimeout(this._timer);
			}
		}
	};
	window.FadeList = fade;
})(window, window.document);
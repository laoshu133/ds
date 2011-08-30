/*
author : laoshu133
update : 2011.05.20
www.laoshu133.com
--data模块, flash模拟一个剪切板, 待验证
*/
;(function(window, undefined){
	//localStorage
	var 
	ieUserData = null,
	ds = {
		supportLocalStorage : !!window.localStorage,
		data : function(name, val){
			var pri = 'ds_data_', stor = window.localStorage, support = ds.supportLocalStorage;
			name = pri + name;
			if(val === undefined){
				return support ? stor[name] : this.userData(name);
			}
			support ? (stor[name] = val) : this.userData(name, val);
			return this;
		},
		getUserData : function(){
			var data = ieUserData, d;
			//必须等文档加载完成
			if(isIE && !data){
				d = new Date();
				d.setDate(d.getDate() + 30);
				try{
					data = createEl('input', {type:'hidden'});
					data.addBehavior ("#default#userData"); 
					data.expries = d.toUTCString();
					doc.body.appendChild(data);
				}catch(_){}
				ieUserData = data;
			}
			return data;
		},
		userData : function(name, val, del){
			var data = this.getUserData(), key = 'ds_data';
			if(data){
				data.load && data.load(key);
				if(del === true && !!name){
					data.removeAttribute(name);
				}
				else if(val === undefined){
					return data.getAttribute(name);
				}
				data.setAttribute(name, val);
				data.save && data.save(key);
			}
			return this;
		},
		removeData : function(name){
			var pri = 'ds_data_', stor = window.localStorage;
			if(this.supportLocalStorage){
				stor[name] &&　stor.removeItem(name);
				return this;
			}
			return this.userData(name, '', true);
		},
		//缓存所有的剪贴板
		clipBoards : {},
		//flash部分摘自 zeroClipboard 这个部分搞的人想死
		addClipboard : function(ops){
			var 
			el,	_noop = function(){},
			_ops = {
				id : 'copycode',
				autoReposition : true,
				clickHandler :_noop,
				complete : _noop,
				handCursor : true
			};
			for(var k in ops){
				_ops[k] = ops[k];
			}
			el = $d(_ops.id);
			if(!el){ return null;}
			var  id = 'ds_clipboard_' + getGuid(),
			bd = doc.body, div = createEl('div', {id:id+'_panel'}),
			h = el.offsetHeight, w = el.offsetWidth,
			pos = ds.getOffset(el), left = pos.left, top = pos.top,
			getTopInx = function(el){
				var offEl = el, tmpEl = el,
				rroot = /^(?:html|body)$/i, zInx;
				while(offEl){
					tmpEl = offEl;
					offEl = offEl.offsetParent;
					if(!offEl || rroot.test(offEl.nodeName)){
						offEl = tmpEl;
						break;
					}
				}
				tmpEl = null;
				zInx = css(offEl, 'zIndex');
				return !zInx || isNaN(zInx) ? 3 : ++zInx;
			};
			css(div, {height:h+'px', width:w+'px', left:left+'px', top:top+'px', zIndex:getTopInx(el)+'', position:'absolute'});
			div.innerHTML = ds.getFlashHTML('js/clipboard.swf', w, h, id, {'flashvars' : 'id=' + id + '&width=' + w + '&height=' + h});
			bd.appendChild(div);
			return ds.clipBoards[id] = {
				id : id,
				backEl : el,
				cursor : !!_ops.handCursor,
				flash : $d(id),
				panel : div,
				setText : _noop,
				load : function(){
					var self = this, flash = self.flash;
					try{
						flash.setHandCursor(this.cursor);
						this.setText = function(str){
							flash.setText(str + '');
						}
						flash.setClickHandler('function(id){var clipObj = ds.clipBoards[id];clipObj.clickHandler();}');
					}catch(_){}
					if(_ops.autoReposition){
						addE(window, 'resize', function(){self.rePosition();});
					}
				},
				clickHandler : function(){
					this.setText(_ops.clickHandler());
				},
				complete : function(str){
					typeof _ops.complete === 'function' && _ops.complete.call(this, str);
				},
				rePosition : function(){
					var el = this.backEl, style = this.panel.style,
					pos = ds.getOffset(el);
					style.left = pos.left + 'px';
					style.top = pos.top + 'px';
				},
				remove : function(){
					if(div && div.parentNode){
						div.innerHTML = '';
						div.parentNode.removeChild(div);
					}
				}
			}
		},
		//触发事件代理
		clipboardFire : function(id, type, args){
			var clipObj = ds.clipBoards[id];
			type = type || 'load';
			if(clipObj){
				clipObj[type](args);
			}
		}
		
	}
})(window);

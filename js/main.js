//执行页面效果
(function(window, doc){
	var $d = ds.$d;
	//focus_ad
	ds.ready(function(){
		var 
		slider,
		el = $d('focus_ad'),
		ops = {
			shell : el,
			direction : 'left',
			trigger : 'mouseenter',
			navEl : 'focus_nav',
			animateEl : ds.$D('ul', el)[0],
			unitSize : 574,
			delay : 5000,
			auto : false
		};
		//top ops -- 如果需要向上滚动，将以下3行注释取消
		//ops.unitSize = 223;
		//ops.duration = 320;
		//ops.direction = 'top';
		slider = new Slider(ops);
	});
	//goodsoft
	ds.ready(function(){
		var nav = $d('goodsoft_nav');
		var slider = new Slider({
			shell : 'soft_panel',
			navEl : nav,
			itemNodeName : 'div',
			trigger : 'click',
			unitSize : 552,
			auto : false,
			//如果想单击TAB时不动画， 将以下设为 false
			isAnimate : true
		});
	});

	//goodsoft item
	var splitLis = function(id, count){
		var 
		ulCount = 1,
		panel = $d(id),
		lis = ds.$D('li', panel),
		lisLen = lis.length,
		frag = doc.createDocumentFragment(),
		getUL = function(){
			var ul = ds.createEl('ul');
			ul.className = 'ico_list';
			return ul;
		},
		appendUL = function(ul){
			ulCount++;
			frag.appendChild(ul);
		}
		ul = getUL();
		if(count >= lisLen) return;
		for(var i = count; i < lisLen; i++){
			el = lis[count];
			if(i > count && i % count === 0){
				appendUL(ul);
				ul = getUL();
			}
			ul.appendChild(el);
		}
		if(i >= count && i % count >= 0){
			appendUL(ul);
		}
		panel.appendChild(frag);
		return ulCount;
	};
	ds.ready(function(){
		var 
		i = 0,
		maxLen = 21,
		currInx = 0,
		prevInx = 0,
		sliders = [
			{
				id : 'soft_all',
				slider : null,
				itemCount : 0,
				splitStatus : false
			},
			{id : 'soft_ios'},
			{id : 'soft_android'},
			{id : 'soft_symbian'},
			{id : 'soft_mtk'}
		],
		sliderObj = null,
		panel = $d('goodsoft'),
		navLinks = ds.$D('a', $d('goodsoft_nav')),
		tabLen = navLinks.length,
		copyObj = function(obj, newObj){
			newObj = newObj || {};
			for(var k in obj){
				if(newObj[k] === void 0){
					newObj[k] = obj[k];
				}
			}
			return newObj;
		},
		btnDefOps = {href : '#', className : 'nav_left', hideFocus : true},
		initNavBtn = function(type){
			var el, isLeft = type !== 'right';
			btnDefOps.className = isLeft ? 'nav_left' : 'nav_right';
			el = ds.createEl('a', btnDefOps);
			el.innerHTML = isLeft ? '←' : '→';
			panel.appendChild(el);
			return el;
		},
		//left_btn, right_btn
		leftBtn = initNavBtn('left'),
		rightBtn = initNavBtn('right'),
		showNavBtn = function(){
			ds.show(leftBtn, true).show(rightBtn, true);
		},
		hideNavBtn = function(){
			ds.hide(leftBtn).hide(rightBtn);
		},
		//slider
		sliderDefOps = {
			navEl : null,
			itemNodeName : 'div',
			unitSize : 552,
			delay : 5000,
			auto : false
		},
		initSlider = function(inx){
			var obj = sliders[inx];
			if(!obj) return;
			obj.itemCount = splitLis(obj.id, maxLen);
			obj.splitStatus = true;
			
			obj.slider = new Slider2({
				shell : obj.id,
				unitSize : 552,
				duration : 420,
				delay : 5000,
				auto : !inx
			});
			/*
			obj.slider = new Slider({
				shell : obj.id,
				navEl : null,
				itemNodeName : 'ul',
				unitSize : 552,
				delay : 5000,
				auto : !inx,
				isAnimate : obj.itemCount > 1
			});*/
			return obj;
		}
		;
		
		//soft_all
		sliderObj = initSlider(0);

		var 
		overFn = function(){ sliders[currInx].slider.stopAuto();},
		outFn = function(){ sliders[currInx].slider.autoPlay();};
		//leftBtn event,Slider2 leftBtn事件不同于Slider
		ds.bind(leftBtn, 'mouseover', overFn).bind(leftBtn, 'mouseout', outFn)
		/*.bind(leftBtn, 'click', function(e){
			var slider = sliders[currInx].slider, inx = slider.prevInx - 1;
			if(inx < 0){
				inx = sliders[currInx].itemCount - 1;
			}
			slider.play(inx);
			e.preventDefault();
		});*/
		.bind(leftBtn, 'click', function(e){
			sliders[currInx].slider.play(-1);
			e.preventDefault();
		});
		//rightBtn event
		ds.bind(rightBtn, 'mouseover', overFn).bind(rightBtn, 'mouseout', outFn)
		.bind(rightBtn, 'click', function(e){
			sliders[currInx].slider.play();
			e.preventDefault();
		});
		//currInx, splitLis
		for(i = 0; i < tabLen; i++){
			ds.bind(navLinks[i], 'click', (function(inx){
				return function(e){
					var currSlider,
					prevSlider = sliders[currInx].slider;
					prevInx = currInx;
					currInx = inx;
					
					if(!sliders[inx].splitStatus){
						initSlider(inx);
					}
					currSlider = sliders[inx].slider;
					
					prevSlider.stopAuto();
					prevSlider.ops.auto = false;
					currSlider.ops.auto = true;
					currSlider.autoPlay();
					if(currSlider.itemCount > 1){
						showNavBtn();
					}
					else{
						hideNavBtn();
					}
					e.preventDefault();
				}
			})(i));
		}
	});
})(window, window.document);
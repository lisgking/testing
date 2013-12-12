//---------------------------------------------------------
// extend native
//---------------------------------------------------------
Math.uuid=function(){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);
		return v.toString(16);
	});
};
Object.flatten=function(source){
	var diveInto=function(obj,result,prefix){
		var key=0,val;
		for(key in obj){
			if(obj.hasOwnProperty(key)){
				val=obj[key];
				if(val instanceof Object){
					diveInto(val,result,prefix+key+".");
				}else{
					result[prefix+key]=val;
				}
			}
		}
	};
	var target={};
	diveInto(source,target,"");
	return target;
};
Object.deepen=function(source){
	var set=function(root,path,value){
		var chain=path.split("."),space=root,l=chain.length-1,i;
		for(i=0;i<l;i++){
			if(space.hasOwnProperty(chain[i])){
				space=space[chain[i]];
			}else{
				space=space[chain[i]]={};
			}
		}
		space[chain[l]]=value;
	};
	var target={},key=0;
	for(key in source){
		if(source.hasOwnProperty(key)){
			set(target,key,source[key]);
		}
	}
	return target;
};
String.format=function(msg,arr){
	var args=arguments;
	return String(msg).replace(/\$([1-9$])/g,function(exp,key){
		return key==="$"?key:args.hasOwnProperty(key)?args[key]:exp;
	});
};

//---------------------------------------------------------
// extend jQuery
//---------------------------------------------------------
(function($){
	function on(type,listener,capture){
		capture=!!capture;
		return this.each(function(index,node){
			node.addEventListener(type,listener,capture);
		});
	}
	function off(type,listener,capture){
		capture=!!capture;
		return this.each(function(index,node){
			node.removeEventListener(type,listener,capture);
		});
	}
	function draggable(options){
		options=$.extend({},draggable.options,options);
		options.effect;
		return this._on("dragstart",function tr_dragStart(event){
			var tr=this,data=event.dataTransfer;
			data.effectAllowed=options.effect;
			data.setData("Text",tr.dataset.key);
		})
	}
	draggable.options={
		type:"move"
	};
	function droppable(options){
		options=$.extend({},droppable.options,options);
		return this._on("dragover",function tr_dragOver(event){
			event.preventDefault();
		})._on("dragleave",function tr_dragLeave(event){
			event.preventDefault();
		})._on("drop",function tr_drop(event){
			event.stopPropagation();
		});
	}
	droppable.options={
		type:"move"
	};
	function swapWith(that){
		var self=this[0],
			other=$(that)[0],
			temp;
		if(self&&other){
			temp=self.parentNode.insertBefore(document.createTextNode(''), self);
			other.parentNode.insertBefore(self, other);
			temp.parentNode.insertBefore(other, temp);
			temp.parentNode.removeChild(temp);
		}
		return this;
	}
	$.fn.extend({
		_on:on,
		_off:off,
		draggable:draggable,
		droppable:droppable,
		swapWith:swapWith
	});
}(jQuery));
// ---------------------------------------------------------
// fix/shim
// ---------------------------------------------------------
if(!console.time)(function(console){
	var labels={},
		perf=window.performance?performance:
			Date.now?Date:
			{now:function(){return +new Date();}};
	console.time=function time(label){
		if(!labels.hasOwnProperty(label)){
			labels[label]=perf.now();
		}
	};
	console.timeEnd=function timeEnd(label){
		var duration=perf.now()-labels[label];
		if(labels.hasOwnProperty(label)){
			console.log(label+": "+(+duration.toFixed(3))+"ms");
		}
	};
}(console));
if(!("innerText" in document.documentElement))(function(){
	HTMLElement.prototype.__defineSetter__("innerText",function(text){
		this.textContent=text;
	});
	HTMLElement.prototype.__defineGetter__("innerText",function(){
		var r=this.ownerDocument.createRange();
		r.selectNodeContents(this);
		return r.toString();
	});
}());
if(!document.documentElement.dataset)(function(){
	function DOMStringMap(elem){
		this.resync(elem);
	}
	var replacer=function(exp,c){return c.toUpperCase();};
	function resync(elem){
		var attrs=elem.attributes,l=attrs.length,i,attr,name,key,val,
			that=this,
			getter=function(){return this;},
			setter=function(name,value){
				if(value==null){
					this.removeAttibute(name);
				}else{
					this.setAttibute(name,value);
				}
				that.resync();
			};
		for(i=0;i<l;i++){
			attr=attrs[i];
			name=attr.name;
			if(name.substr(0,5)==="data-"){
				key=name.substr(5).replace(/-(.)/g,replacer);
				val=attr.value;
				Object.defineProperty(this,key,{
					configurable:true,
					enumerable:true,
					get:getter.bind(val||""),
					set:setter.bind(elem,name)
				});
			}
		}
	};
	Object.defineProperty(DOMStringMap.prototype,"resync",{
		enumerable:false,
		value:resync
	});
	var descriptor={
		enumerable:true,
		get:function(){
			var elem=this,_dataset=elem._dataset;
			if(!elem.hasOwnProperty("_dataset")){
				elem._dataset=_dataset=new DOMStringMap(elem);
			}else{
				_dataset.resync(elem);
			}
			return _dataset;
		}
	};
	Object.defineProperty(HTMLElement.prototype,"dataset",descriptor);
}());

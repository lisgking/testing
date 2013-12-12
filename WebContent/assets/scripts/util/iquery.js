/**
 * iQuery.js
 * 
 * @require DOM Events Ajax
 * Element [getElementsByClassName]
 * HTMLElement [addEventListener, classList, dataset, hidden]
 * HTMLDocument [querySelector, querySelectorAll]
 * Array.prototype [forEach, indexOf, lastIndexOf, some, every, filter, map]
 */

(function(window){
	"use strict";
	/**
	 * DOM Objects
	 */
	var doc=window.document,
		root=doc.documentElement,
		rURI=/^((https?:|file:)\/\/(([^:\/]+)(:\d+)?))([^?#]*)([^#]*)(.*)$/,
		rID_CLASS_TAG=/^[#.]?([A-Za-z][\w-]*)$/;
	
	function $(s,c){
		var l=arguments.length;
		return l==0?new NodeList():l==1?new NodeList(s):new NodeList(s,c);
	}
	/**
	 * constructor(String [,Node])
	 * constructor(Node | Window)
	 * constructor(NodeList | HTMLCollection | Array)
	 * constructor(Function)
	 * constructor()
	 */
	function NodeList(s,c){// s:selector, c:element|document
		var t=this,nl,l,i,c0,m,fn;// nl:NodeList, l:length, i:iterator, c0:charAt(0),m:matched array
		if(!s){return t};
		if(s.charAt){
			c=arguments.length>1?c:doc,c0=s.charAt(0),m=s.match(rID_CLASS_TAG);
			if(m){
				if(c0=="#"){
					nl=doc.getElementById(m[1]);
					if(nl){nl=[nl];}else{return t;}
				}else if(c0=="."){
					nl=c.getElementsByClassName(m[1]);
				}else{
					nl=c.getElementsByTagName(m[1]);
				}
			}else if(c0=="<"&&s.charAt(s.length-1)==">"&&s.length>2){
				nl=$.toNodeList(s);
			}else{
				nl=c.querySelectorAll(s);
			}
		}else if(s.addEventListener){
			nl=[s];
		}else if(s instanceof NodeList){
			return s;
		}else if(s.item instanceof Function|s instanceof Array){
			nl=s;
		}else if(s instanceof Function){
			return $(doc).one("DOMContentLoaded",function(){s.call(this,$);});
		}else{
			throw new TypeError("Invalid arguments");
		}
		for(l=nl.length,i=0;i<l;i+=1){t[i]=nl[i];}
		if(l)t.length=l;
		return t;
	}
	function sorter(a,b){
		var compare = a.compareDocumentPosition(b);
		return compare & a.DOCUMENT_POSITION_FOLLOWING ? -1 :
			compare & a.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
	}
	function install(args){
		var len=args.length,i;
		if(args instanceof Array){
			for(i=0;i<len;i+=2){
				this[args[i]]=args[i+1];
			}
		}else if(args instanceof Object){
			for(i in args){
				if(args.hasOwnProperty(i)){this[i]=args[i];}
			}
		}
	}
	/**
	 * prototype core
	 */
	var proto={
		constructor:$,
		length:0,
		item:function(index){
			return this.hasOwnProperty(index)?this[index]:null;
		},
		query:function(s){
			return new NodeList(s,this[0]);
		},
		parent:function(s){
			var nodes=$();
			var matchesSelector=$.vars.matchesSelector;
			if(s){
				this.forEach(function(node){
					var parent=node.parentNode;
					if(parent[matchesSelector](s)){nodes.push(parent);}
				});
			}else{
				this.forEach(function(node){
					nodes.push(node.parentNode);
				});
			}
			nodes.uniqueSort();
			return nodes;
		},
		children:function(s){
			var nodes=$();
			var matchesSelector=$.vars.matchesSelector;
			if(s){
				this.forEach(function(node){
					var children=Array.prototype.slice.call(node.children).filter(function(child){
						return child[matchesSelector](s);
					});
					nodes.push.apply(nodes,children);
				});
			}else{
				this.forEach(function(node){nodes.push.apply(nodes,node.children);});
			}
			nodes.uniqueSort();
			return nodes;
		},
		firstChild:function(){
			var nodes=$();
			this.forEach(function(node){
				if(node=node.firstElementChild){nodes.push(node);}
			});
			return nodes;
		},
		nthChild:function(n){
			var nodes=$();
			this.forEach(function(node){
				if(node=node.children[n-1]){nodes.push(node);}
			});
			return nodes;
		},
		nthLastChild:function(n){
			var nodes=$();
			this.forEach(function(node){
				node=node.children;
				if(node=node[node.length-n]){nodes.push(node);}
			});
			return nodes;
		},
		lastChild:function(){
			var nodes=$();
			this.forEach(function(node){
				if(node=node.lastElementChild){nodes.push(node);}
			});
			return nodes;
		},
		closest:function(s){
			var nodes=$();
			var matchesSelector=$.vars.matchesSelector;
			this.forEach(function(node){
				do{
					if(node[matchesSelector](s)){
						nodes.push(node);
						break;
					}
					node=node.parentNode;
				}while(node.nodeType===1);
			});
			nodes.uniqueSort();
			return nodes;
		},
		next:function(s){
			var nodes=$();
			var matchesSelector=$.vars.matchesSelector;
			this.forEach(function(node){
				if(node=node.nextElementSibling){
					if(s){
						if(node[matchesSelector](s)){nodes.push(node);}
					}else{
						nodes.push(node);
					}
				}
			});
			nodes.uniqueSort();
			return nodes;
		},
		nextAll:function(s){
			var nodes=$();
			var matchesSelector=$.vars.matchesSelector;
			this.forEach(function(node){
				while(node=node.nextElementSibling){
					if(s){
						if(node[matchesSelector](s)){nodes.push(node);}
					}else{
						nodes.push(node);
					}
				}
			});
			nodes.uniqueSort();
			return nodes;
		},
		prev:function(s){
			var nodes=$();
			var matchesSelector=$.vars.matchesSelector;
			this.forEach(function(node){
				if(node=node.previousElementSibling){
					if(s){
						if(node[matchesSelector](s)){nodes.push(node);}
					}else{
						nodes.push(node);
					}
				}
			});
			nodes.uniqueSort();
			return nodes;
		},
		prevAll:function(s){
			var nodes=$();
			var matchesSelector=$.vars.matchesSelector;
			this.forEach(function(node){
				while(node=node.previousElementSibling){
					if(s){
						if(node[matchesSelector](s)){nodes.push(node);}
					}else{
						nodes.push(node);
					}
				}
			});
			nodes.uniqueSort();
			return nodes;
		},
		uniqueSort:function(){
			Array.prototype.sort.call(this,sorter);
			var a=this,l=a.length,i,j,hasDuplicate=false;
			testDuplicate:for(i=0;i<l-1;i+=1){
				for(j=i+1;j<l;j+=1){
					if(a[i]===a[j]){
						hasDuplicate=true;
						break testDuplicate;
					}
				}
			}
			if(hasDuplicate){
				for(j=l-1;j>0;j-=1){if(a[j]===a[j-1]){a.splice(j,1);}}
			}
		},
		/**
		 * The following functions are copied and/or overwrote from Array prototype,
		 * usage is similar as Array API,
		 * except that they may return NodeList rather than Array in some cases
		 */
		forEach:function(){return Array.prototype.forEach.apply(this,arguments),this;},
		indexOf:Array.prototype.indexOf,
		lastIndexOf:Array.prototype.lastIndexOf,
		map:Array.prototype.map,
		some:Array.prototype.some,
		every:Array.prototype.every,
		filter:Array.prototype.filter,
		concat:function(){
			var ret=$(this.slice(0));
			$.forEach(arguments,function(list){
				ret.push.apply(ret,list instanceof Array?list:$.toArray(list));
			});
			return ret;
		},
		push:Array.prototype.push,
		pop:Array.prototype.pop,
		unshift:Array.prototype.unshift,
		shift:Array.prototype.shift,
		reverse:Array.prototype.reverse,
		slice:function(){return $(Array.prototype.slice.apply(this,arguments));},
		splice:function(){return $(Array.prototype.splice.apply(this,arguments));},
		toArray:function(){return Array.prototype.slice.call(this);}
	};
	$.prototype=NodeList.prototype=proto;
	$.install=$.prototype.install=install;
	/*------------------utilities----------------*/
	var util={
		iQuery:"0.0.1",
		forEach:function(list,cb,sc){
			return Array.prototype.forEach.call(list,cb,sc),list;
		},
		extend:function(deep,obj,exts){
			var args=arguments,len,i,ext,key;
			if(typeof deep=="boolean"){
				exts=Array.prototype.slice.call(args,2);
				obj=(obj instanceof Object)?obj:{};
			}else{
				exts=Array.prototype.slice.call(args,1);
				obj=(deep instanceof Object)?deep:{};
				deep=false;
			}
			exts.forEach(function(ext){
				if(deep){ext=util.clone(ext);}
				if(ext instanceof Object){
					for(key in ext){if(ext.hasOwnProperty(key)){obj[key]=ext[key];}}
				}
			});
			return obj;
		},
		clone:function clone(obj,deep){
			var copy;
			if(obj instanceof Object){
				if(obj instanceof Function){
					copy=obj;
				}else if(obj instanceof Date||obj instanceof RegExp||
						obj instanceof Boolean||obj instanceof Error){
					copy=new (obj.constructor)(obj.valueOf());
				}else if(obj instanceof Element){
					copy=obj.cloneNode(true);
				}else{
					var props=Object.getOwnPropertyNames(obj),len=props.length,i,
						key,val,copy=obj instanceof Array?obj.slice(0):{};
					for(i=0;i<len;i+=1){
						key=props[i],val=obj[key];
						if(val!==undefined){
							copy[key]=deep?util.clone(val):val;
						}
					}
				}
			}else{
				copy=obj;
			}
			return copy;
		},
		toArray:function(obj){
			return Array.prototype.slice.call(obj);
		},
		toMap:function(obj){
			var map={},keys=Objec.keys(obj),len=keys.length,i,key;
			for(i=0;i<len;i+=1){key=keys[i],map[key]=obj[key];}
			return map;
		},
		toNodeList:function(s){
			var div=doc.createElement("div");
			div.innerHTML=s;
			return div.children;
		},
		createElem:function(tag,attr,parent){
			var elem=doc.createElement(tag);
			if(attr instanceof Object){
				for(var name in attr){
					if(attr.hasOwnProperty(name)){elem.setAttribute(name,attr[name]);}
				}
			}
			if(parent){
				parent.appendChild(elem);
			}
			return elem;
		},
		toSearchObject:function(search){
			var params={};
			util.toSearchArray(search).forEach(function(param){
				var name=param.name,value=param.value;
				if(!params.hasOwnProperty(name)){params[name]=value;}
			});
			return params;
		},
		toSearchArray:function(search){
			var params=[],dec=decodeURIComponent;
			search.split("&").forEach(function(slice,index){
				if(!slice){return;}
				var eqIndex=slice.indexOf("="),name,value;
				if(eqIndex<0){eqIndex=slice.length;}
				name=dec(slice.substr(0,eqIndex));
				value=dec(slice.substr(eqIndex+1));
				params.push({name:name,value:value});
			});
			return params;
		},
		toSearchString:function(data){
			var enc=encodeURIComponent,params=[],param,keys,key,len,i,key;
			if(data instanceof Array){
				len=data.length;
				for(i=0;i<len;i+=1){
					param=data[i];
					params.push(enc(param.name)+"="+enc(param.value));
				}
			}else{
				keys=Object.keys(data),len=keys.length;
				for(i=0;i<len;i+=1){
					key=keys[i];
					params.push(enc(key)+"="+enc(data[key]));
				}
			}
			return params.join("&");
		},
		toURIString:function(href){
			var a=doc.createElement("a"),uri;
			a.href=href,uri=a.href;
			if(href==""){uri=uri.substr(0,uri.lastIndexOf("/")+1);}
			return uri;
		},
		toPropPrefixed:function(prop,type){
			return $.vars.domPrefix+prop.charAt(0).toUpperCase()+prop.substr(1);
		},
		toURIObject:function(uri){
			var loc=null;
			uri.replace(rURI,function(href,origin,protocol,host,hostname,colon_port,pathname,search,hash){
				loc={
					protocol:protocol,
					hostname:hostname,
					port:colon_port.substr(1),
					pathname:pathname,
					search:search,
					hash:hash,
					host:host,
					href:href,
					origin:origin
				};
				Object.defineProperty(loc,"toString",{value:function toString(){return this.href;}});
			});
			return loc;
		},
		hasStyle:function(prop){
			function titleCase(word){
				return word.charAt(0).toUpperCase()+word.substr(1);
			}
			var style=document.documentElement.style;
			return style.hasOwnProperty(prop)||style.hasOwnProperty(util.vars.stylePrefix+titleCase(prop));
		}
	};
	$.install(util);
	/*-----------------variables-----------------*/
	var browser=(function(window){
		var r={
			Engine:/(WebKit|Gecko|Trident|Presto|KHTML)\/([\d.]+)/,
			Chrome_Firefox_Konqueror:/(Chrome|Firefox|Konqueror)\/([\d.ab]+)/,
			Safari:/(?:Macintosh|iPhone|iPad|Windows).+Version\/([\d.]+).+(Safari)/,
			MSIE:/(MSIE) ([\d.]+)/,
			Opera:/(Opera).+Version\/([\d.]+)/,
			Windows:/(Windows) NT ([\d.]+)/,
			Macintosh:/(Macintosh).+OS X ([\d._]+)/,
			Unix:/(Linux|X11|BSD|SunOS)()/,
			iOS:/(iPhone|iPad).+ OS ([\d._]+)/,
			Android:/(Android) ([\d.]+).*; (.+) Build/,
			WindowsPhone:/(Windows Phone OS|Windows Phone) ([\d.]+).*; (.+)\)/,
			BlackBerry:/(BlackBerry|BB10).+Version\/([\d.]+)/
		},
		ua=window.navigator.userAgent,
		mapping={
			Linux:"Unix",X11:"Unix",BSD:"Unix",SunOS:"Unix",
			iPhone:"iOS",iPad:"iOS",Android:"Android",
			"Windows Phone":"WindowsPhone","Windows Phone OS":"WindowsPhone",
			BlackBerry:"BlackBerry",BB10:"BlackBerry"
		},
		browser={
			engine: "",engineVersion: "",
			appName: "",appVersion: "",
			platform:"",platformVersion:"",
			mobile:false,device:""
		},m,p;
		if(m=ua.match(r.Engine)){
			browser.engine=m[1],browser.engineVersion=m[2];
			if((m=ua.match(r.Chrome_Firefox_Konqueror)||ua.match(r.MSIE)||ua.match(r.Opera))){
				browser.appName=m[1],browser.appVersion=m[2];
			}else if((m=ua.match(r.Safari))){
				browser.appName=m[2],browser.appVersion=m[1];
			}
		}
		if((m=ua.match(r.Windows)||ua.match(r.Macintosh))){
			browser.platform=m[1],browser.platformVersion=m[2].replace(/_/g,".");
		}else if((m=ua.match(r.iOS)||ua.match(r.Android)||ua.match(r.WindowsPhone)||ua.match(r.BlackBerry))){
			browser.platform=mapping[m[1]],browser.platformVersion=m[2].replace(/_/g,"."),
			browser.mobile=true,p=m[1];
			switch(p){
				case "iPhone":case "iPad":browser.device=p;break;
				case "Android":case "Windows Phone":case "Windows Phone OS":browser.device=m[3];break;
				case "BlackBerry":case "BB10":browser.device=mapping[p];break;
			}
		}else if((m=ua.match(r.Unix))){
			browser.platform=mapping[m[1]],browser.platformVersion=m[2]
		}
		return browser;
	}(window));
	var vars=(function(window){
		var mapping={"WebKit":"Webkit","Gecko":"Moz","Trident":"ms","Presto":"O","KHTML":"Khtml"},
			props=["BorderRadius","Transition","Animation"],
			prefix=mapping[browser.engine]||"",
			style=window.document.documentElement.style,
			confirm=props.some(function(prop,index){return prefix+prop in style;});
		return {
			cssPrefix:prefix?"-"+prefix.toLowerCase()+"-":"",
			domPrefix:prefix.toLowerCase(),
			stylePrefix:prefix
		};
	}(window));
	$.browser=browser;
	$.vars=vars;
	vars.matchesSelector=("matchesSelector" in root)?"matchesSelector":
				($.toPropPrefixed("matchesSelector") in root)?$.toPropPrefixed("matchesSelector"):"";
	/*------------------utilities----------------*/
	$.iQuery=window.iQuery;
	window.iQuery=$;
}(window));


(function($){
	function on(name,handler,capture){
		capture=!!capture;
		return this.forEach(function(elem){
			elem.addEventListener(name,handler,capture);
		});
	}
	/**
	 * off(name:String,handler:Function,capture:Boolean):$  //remove a event listener which added by on()
	 */
	function off(name,handler,capture){
		capture=!!capture;
		if(handler.origin){
			if(handler.capture===capture){
				handler=handler.origin;
			}else{
				return this;
			}
		}
		return this.forEach(function(elem){
			elem.removeEventListener(name,handler,capture);
		});
	}
	/**
	 * one(name:String,handler:Function,capture:Boolean):$  //add an once event listener
	 */
	function one(name,handler,capture){
		capture=!!capture;
		function once(){$(this).off(name,once,capture);return handler.apply(this,arguments);};
		once.listener=handler;
		once.capture=capture;
		return this.forEach(function(elem){
			elem.addEventListener(name,once,capture);
		});
	}
	/**
	 * live(name:String,handler:Function,capture:Boolean):$
	 */
	function live(name,handler,capture){
		//TODO live
	}
	/**
	 * die(name:String,handler:Function,capture:Boolean):$
	 */
	function die(name,handler,capture){
		//TODO die
	}
	/**
	 * trigger(name:String):$            //trigger click focus or blur
	 */
	function trigger(name){
		if(name=="click"||name=="focus"||name=="blur"){
			return this.forEach(function(elem){
				elem[name]();
			});
		}
	}
	$.prototype.install([
		"on",on,
		"off",off,
		"one",one,
		"live",live,
		"die",die,
		"trigger",trigger
	]);
}(iQuery));

(function($){
	var sBoolAttrs="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
		rBoolAttrs=new RegExp("^(?:"+sBoolAttrs+")$","i"),
		aBoolAttrs=sBoolAttrs.split("|");
	/**
	 * prop(name:String,value:*):$   //set a property
	 * prop(map:Object):$            //set properties
	 * prop(name:String):*           //get a property of first one
	 */
	function prop(name,value){
		var args=arguments,l=args.length;
		if(l==1){
			if(typeof name=="string"){
				return this.hasOwnProperty(0)?this[0][name]:null;
			}else if(name instanceof Object){
				var obj=name,key;
				return this.forEach(function(elem){
					for(key in obj){if(obj.hasOwnProperty(key)){elem[key]=obj[key];}}
				});
			}
		}else if(l==2){
			return this.forEach(function(elem){
				elem[name]=value;
			});
		}
	}
	/**
	 * removeProp(name:String):$     //remove a property
	 */
	function removeProp(name){
		name=name=="htmlFor"?"for":name=="className"?"class":name;
		return this.forEach(function(elem){
			if(elem.hasAttribute(name)){
				elem.removeAttribute(name);
			}else{
				delete elem[name];
			}
		});
	}
	
	/**
	 * toggleProp(name:String):$     //remove a attribute
	 */
	function toggleProp(name,add){
		if(!rBoolAttrs.test(name)){
			return this;
		}
		if(add===undefined){
			return this.forEach(function(elem){
				elem[name]=!elem[name];
			});
		}else{
			return this.prop(name,!!add);
		}
	}
	/**
	 * attr(name:String,value:String):$//set a attribute
	 * attr(map:Object):$            //set attributes
	 * attr(name:String):*           //get a property of first one
	 */
	function attr(name,value){
		var args=arguments,l=args.length;
		if(l==1){
			if(typeof name=="string"){
				var first=this[0];
				return this.hasOwnProperty(0)?this[0].getAttribute(name):null;
			}else if(typeof name=="object"&&name){
				var obj=name,key;
				return this.forEach(function(elem){
					for(key in obj){if(obj.hasOwnProperty(key)){elem.setAttribute(key,obj[key]);}}
				});
			}
		}else if(l==2){
			return this.forEach(function(elem){
				elem.setAttribute(name,value);
			});
		}
	}
	/**
	 * removeAttr(name:String):$     //remove a attribute
	 */
	function removeAttr(name){
		return this.forEach(function(elem){
			elem.removeAttribute(name);
		});
	}
	/**
	 * toggleAttr(name:String):$     //remove a attribute
	 */
	function toggleAttr(name,add){
		if(!rBoolAttrs.test(name)){
			return this;
		}
		if(add===undefined){
			return this.forEach(function(elem){
				elem.hasAttribute(name)?elem.removeAttribute(name):elem.setAttribute(name,name);
			});
		}else{
			return add?this.attr(name,name):this.removeAttr(name);
		}
	}
	/**
	 * data(name:String,value:String):$//set single data
	 * data(map:Object):$            //set data attributes
	 * data(name:String):String|null //get a data attribute of first one
	 */
	function data(name,value){
		var args=arguments,l=args.length,obj=name,key;
		if(l==1){
			if(obj instanceof Object){
				return this.forEach(function(elem){
					for(key in obj){elem.dataset[key]=obj[key];}
				});
			}else if(typeof name=="string"){
				return this.hasOwnProperty(0)?this[0].dataset[name]:null;
			}
		}else if(l==2){
			this.forEach(function(elem){
				elem.dataset[name]=value;
			});
			return this;
		}
	}
	/**
	 * removeData(name):$            //remove a data attribute
	 */
	function removeData(name){
		return this.forEach(function(elem){
			delete elem.dataset[name];
		});
	}
	/**
	 * style(prop:String,value:String):$//set a style property
	 * style(props:Object):$           //set multiple style properties
	 * style(prop:String):String       //get a style property of first one
	 */
	function style(prop,value){
		var l=arguments.length;
		if(l==1){
			if(typeof prop=="string"){
				return this.hasOwnProperty(0)?this[0].style[prop]:null;
			}else if(typeof prop=="object"&&prop){
				var key;
				return this.forEach(function(elem){
					for(key in prop){if(prop.hasOwnProperty(key)){elem.style[key]=prop[key];}}
				});
			}
		}else if(l==2){
			return this.forEach(function(elem){
				elem.style[prop]=value;
			});
		}
	}
	/**
	 * removeStyle(prop:String):$      //remove a style property
	 */
	function removeStyle(prop) {
		return this.forEach(function(elem){
			elem.style.removeProperty(name);
		});
	}
	/**
	 * addClass(name:String):$        //add a class
	 */
	function addClass(name){
		return this.forEach(function(elem){
			elem.classList.add(name);
		});
	}
	/**
	 * removeClass(name:String):$     //remove a class
	 */
	function removeClass(name){
		return this.forEach(function(elem){
			elem.classList.remove(name);
		});
	}
	/**
	 * toggleClass(name:String):$     //toggle a class
	 * toggleClass(name:String,add:Boolean):$ //addClass if add, or vice versa
	 */
	function toggleClass(name,add){
		var args=arguments;
		return this.forEach(function(elem){
			var cl=elem.classList;
			cl.toggle.apply(cl,args);
		});
	}
	/**
	 * replaceClass(name:String,repl:String):$ //replace name with repl
	 */
	function replaceClass(name,repl){
		return this.forEach(function(elem){
			if(elem.classList.contains(name)){
				elem.classList.remove(name);
				elem.classList.add(repl);
			}
		});
	}
	/**
	 * hasClass(name:String):Boolean       //indicates whether the first one has a class
	 */
	function hasClass(name){
		return this.hasOwnProperty(0)?this[0].classList.contains(name):null;
	}
	/**
	 * show():$                      //show element
	 */
	function show(){
		return this.forEach(function(elem){
			elem.hidden=false;
		});
	}
	/**
	 * hide():$                      //hide element
	 */
	function hide(){
		return this.forEach(function(elem){
			elem.hidden=true;
		});
	}
	/**
	 * toggle():$                   //switch visibility
	 */
	function toggle(show){
		return this.forEach(function(elem){
			elem.hidden=show===undefined?!elem.hidden:!show;
		});
	}
	/**
	 * innerText(str:String):$       //set innerText
	 * innerText():String|null       //get innerText of first one
	 */
	function text(text){
		if(arguments.length==0){
			return this.prop("innerText");
		}else{
			return this.prop("innerText",text);
		}
	}
	/**
	 * innerHTML(html:String):$      //set innerHTML
	 * innerHTML():String|null       //get innerHTML of first one
	 */
	function html(html){
		if(arguments.length==0){
			return this.prop("innerHTML");
		}else{
			return this.prop("innerHTML",html);
		}
	}
	/**
	 * value(value:String):$         //set value
	 * value():String|null           //get value of first one
	 */
	function value(value){
		if(arguments.length==0){
			return this.prop("value");
		}else{
			return this.prop("value",value);
		}
	}
	/**
	 * values(values:Array):$        //set checked/selected values of radio group/checkbox group/select options
	 * values():Array                //get checked/selected values of radio group/checkbox group/select options
	 */
	function values(values){
		var l=arguments.length,first=this[0],nodeName,inputType;
		if(!first){return l==0?null:this;}
		nodeName=first.nodeName.toLowerCase();
		if(l==0){
			values=[];
			if(nodeName=="select"){
				$.forEach(first.options,function(option){
					if(option.selected){values.push(option.value);}
				});
				return values;
			}else if(nodeName=="input"){
				inputType=first.type;
				if(inputType=="checkbox"||inputType=="radio"){
					$.forEach(first.form.elements.namedItem(first.name),function(input){
						if(input.type==inputType&&input.checked){values.push(input.value);}
					});
					return values;
				}
			}
			return null;
		}else{
			if(nodeName=="select"){
				$.forEach(first.options,function(option,index){
					option.selected=(values.indexOf(option.value)>-1);
				});
			}else if(nodeName=="input"){
				inputType=first.type;
				if(inputType=="checkbox"||inputType=="radio"){
					$.forEach(first.form.elements.namedItem(first.name),function(input){
						input.checked=(values.indexOf(input.value)>-1);
					});
				}
			}
			return this;
		}
	}
	function append(content){
		if(!content){return this;}
		if(typeof content=="string"){
			this.forEach(function(node){
				$($.toNodeList(content)).forEach(function(child){
					node.appendChild(child);
				});
			});
		}else if(content.nodeType==1){
			if(this.hasOwnProperty(0))this[0].appendChild(content);
		}
		return this;
	}
	function prepend(elem){
		//TODO prepend
		return this;
	}
	function before(content){
		if(!content){
			return this;
		}else if(typeof content=="string"){
			
		}else if(content.nodeType){
			
		}
		//TODO before
		return this.forEach(function(elem) {
			var parent;
			if(parent=this.parentNode){
				parent.insertBefore(content,elem);
			}
		});
	}
	function after(){
		//TODO after
	}
	function wrap(){
		//TODO wrap
	}
	function nest(){
		//TODO nest
	}
	function clone(){
		return $(this.map(function(elem){
			return elem.cloneNode(true);
		}));
	}
	function empty(){
		return this.prop("innerHTML","");
	}
	function remove(){
		return this.forEach(function(elem){
			if(elem.parentNode)elem.parentNode.removeChild(elem);
		});
	}
	$.prototype.install([
		"prop",prop,
		"removeProp",removeProp,
		"toggleProp",toggleProp,
		"attr",attr,
		"removeAttr",removeAttr,
		"toggleAttr",toggleAttr,
		"data",data,
		"removeData",removeData,
		"style",style,
		"removeStyle",removeStyle,
		"addClass",addClass,
		"removeClass",removeClass,
		"toggleClass",toggleClass,
		"replaceClass",replaceClass,
		"hasClass",hasClass,
		"show",show,
		"hide",hide,
		"toggle",toggle,
		"text",text,
		"html",html,
		"value",value,
		"values",values,
		"prepend",prepend,
		"append",append,
		"before",before,
		"after",after,
		"wrap",wrap,
		"nest",nest,
		"clone",clone,
		"empty",empty,
		"remove",remove
	]);
}(iQuery));

(function($){
	function XHR(){
		
	}
	var ajax={
		ajax:function(options){
			var xhr=new XMLHttpRequest(),url,param;
			$.extend(xhr,options);
			if(xhr.url){
				url=xhr.url;
				if(xhr.method=="GET"&&xhr.data){
					param=$.toParamString(xhr.data);
					if(url.indexOf("?")<0){
						url+="?"+param;
					}else if(url.substr(-1)==="&"){
						url+=param;
					}else{
						url+="&"+param;
					}
					xhr.open(xhr.url);
				}else if(xhr.method=="POST"&&xhr.data){
					
				}
			}
			return xhr;
		}
	};
	ajax.options= {
		onabort:null,
		onerror:null,
		onload:null,
		onloadend:null,
		onloadstart:null,
		onprogress:null,
		onreadystatechange:null,
		ontimeout:null,
		timeout:0
	};
	$.extend($,ajax);
}(iQuery));
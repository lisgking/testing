/**
 * Internationalization(i18n)
 * Description: chrome.i18n sub-implementation for the open web
 * Author:Fuwei Chin
 * Date: Sun, 10 Nov 2013 13:34:00 GMT
 */
(function(window,undefined){
	var document=window.document,
		root=document.documentElement;
	function mixin(){
		var target=this,srcs=Array.prototype.slice.call(arguments);
		srcs.forEach(function(src){
			if(!(src instanceof Object)){return;}
			var obj=target,key;
			for(key in src){if(src.hasOwnProperty(key)){obj[key]=src[key];}}
		});
		return target;
	}
	function access(obj,path){
		var parts=path.split("."),prop,i,l=parts.length;
		for(i=0;i<l;i+=1){
			if(obj instanceof Object&&obj.hasOwnProperty(prop=parts[i])){
				obj=obj[prop];
			}else{
				obj=undefined;
				break;
			}
		}
		return obj;
	}
	function localize(lang){
		return lang?lang.replace("-","_"):"";
	}
	function MessageMap(msgs){
		this.mixin(msgs);
	}
	MessageMap.prototype.mixin=mixin;
	var i18n={
		baseLocale:"en",
		locale:localize(document.documentElement.lang),
		baseMessages:{},
		messages:{},
		bundle:{},
		define:function(locale,msgs){
			var i18n=this;bundle=i18n.bundle;
			if(bundle.hasOwnProperty(locale)){
				bundle[locale].mixin(msgs);
			}else{
				if(locale==i18n.baseLocale){
					bundle[locale]=i18n.baseMessages=new MessageMap(msgs);
				}else if(locale==i18n.locale){
					bundle[locale]=i18n.messages=new MessageMap(i18n.baseMessages).mixin(msgs);
				}else{
					var script=document.currentScript||(function(s){return s[s.length-1];}(document.scripts)),
						log="i18n resource %s requested with %s but intepereted as %s";
					console.log(log, script.src, i18n.locale+","+i18n.baseLocale, locale);
				}
			}
		},
		init:function(){
			var i18n=this;
			var readyState=document.readyState;
			if(readyState=="loading"){
				document.addEventListener("DOMContentLoaded",function initI18n(){
					i18n.init();
					document.removeEventListener("DOMContentLoaded",initI18n);
				});
				return;
			}
			i18n.translate("[data-i18n]","data-i18n","innerText");
			i18n.translate("[data-i18n-value]","data-i18n-value","value");
			//i18n.translate("[data-i18n-placeholder]","data-i18n-placeholder","placeholder");
			//i18n.translate("optgroup[data-i18n-label]","data-i18n-label","label");
			//i18n.translate("[data-i18n-title]","data-i18n-title","title");
		},
		translate:function(query,attr,prop){
			var items=document.querySelectorAll(query),len=items.length,i18n=this,
				item,key,msg,args,sep="; ",i;
			for(i=0;i<len;i+=1){
				item=items[i];
				key=item.getAttribute(attr);
				args=item.getAttribute("data-i18n-args");
				msg=args?i18n.getMessage(key,args.split(sep)):i18n.getMessage(key);
				if(msg!==null){item[prop]=msg;}
			}
		},
		byKey:function(key){
			if(!this.messages.hasOwnProperty(key)){
				if(!this.baseMessages.hasOwnProperty(key)){return null;}
				return this.baseMessages[key];
			}
			return this.messages[key];
		},
		getMessage:function(key,arr){
			var msg=access(this.messages,key),args;
			if(msg==undefined){
				msg=access(this.baseMessages,key)
				if(msg==undefined){return null;}
			}
			if(arr instanceof Array){arr.unshift(key);args=arr;}else{args=arguments;}
			if(args.length&&typeof msg=="string"){
				msg=msg.replace(/\$([1-9$])/g,function(exp,key){
					return key=="$"?key:args.hasOwnProperty(key)?args[key]:exp;
				});
			}
			return msg;
		}
	};
	window.i18n=i18n;
	if(!("innerText" in document.documentElement)){
		HTMLElement.prototype.__defineSetter__("innerText",function(text){
			this.textContent=text;
		});
		HTMLElement.prototype.__defineGetter__("innerText",function(text){
			var r=this.ownerDocument.createRange();
			r.selectNodeContents(this);
			return r.toString();
		});
	};
}(window));




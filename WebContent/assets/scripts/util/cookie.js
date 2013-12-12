/**
 * cookieStorage
 * Description: localStorage-like API for cookie manipulation
 * Author:Fuwei Chin
 * Date: Wed, 23 Oct 2013 17:06:00 GMT
 */
(function(window){
	var doc=window.document,
		enc=encodeURIComponent,
		dec=decodeURIComponent;
		keywords="expires,max-age,path,domain,secure".split(",");
	function Storage(){}
	function key(index) {
		var cookie=doc.cookie,items=[],l,item,key,value;
		if(cookie){
			items=cookie.split("; "),l=items.length;
			if(index<l){
				item=items[index],eq=item.indexOf("=");
				if(eq<0){eq=item.length;}
				key=dec(item.substr(0,eq));
				return key;
			}
		}
		return null;
	}
	function getItem(key){
		var cookie=doc.cookie,items=[],i,l,item,k,value;
		if(cookie){
			items=cookie.split("; "),l=items.length;
			for(i=0;i<l;i+=1){
				item=items[i],eq=item.indexOf("=");
				if(eq<0){eq=item.length;}
				k=dec(item.substr(0,eq));
				if(key===k){
					value=dec(item.substr(eq+1));
					return value;
				}
			}
		}
		return null;
	}
	function setItem(key,value,expires,path,domain,secure){
		if(key===null||key===undefined||keywords.indexOf(key)>-1||value===null||value===undefined){return false;}
		var cookie,items=[];
		items.push(enc(key)+"="+enc(value));
		if(typeof expires=="string"){
			items.push("expires="+expires);
		}else if(expires instanceof Date){
			items.push("expires="+expires.toUTCString());
		}else if(typeof expires=="number"){
			items.push("max-age="+expires===Infinity?0x7fffffff:Math.round(expires));
		}
		if(path)items.push("path="+path);
		if(domain)items.push("domain="+domain);
		if(secure)items.push("secure");
		cookie=items.join("; ");
		doc.cookie=cookie;
		return true;
	}
	function removeItem(key,path,domain){
		if(key===null||key===undefined||this.getItem(key)===null){return false;}
		var cookie,items=[];
		items.push(enc(key)+"=");
		items.push("expires="+new Date(0).toUTCString());
		if(path)items.push("path="+path);
		if(domain)items.push("domain="+domain);
		cookie=items.join("; ");
		doc.cookie=cookie;
		return true;
	}
	function clear(path,domain) {
		var cookie=doc.cookie,items=[],i,l,item;
		var extras=("; expires="+new Date(0).toUTCString())+(path?"; path="+path:"")+(domain?"; domain="+domain:"");
		if(cookie){
			items=cookie.split("; "),l=items.length;
			for(i=0;i<l;i+=1){doc.cookie=items[i]+extras;}
		}
		return true;
	}
	function length(){
		var cookie=doc.cookie;
		return cookie?cookie.split("; ").length:0;
	}
	Object.defineProperties(Storage.prototype,{
		constructor:{value:Storage},
		key:{value:key},
		getItem:{value:getItem},
		setItem: {value:setItem},
		removeItem:{value:removeItem},
		clear:{value:clear}
	});
	var cookieStorage=new Storage();
	Object.defineProperty(cookieStorage,"length",{set:Function.prototype,get:length});
	window.cookieStorage=cookieStorage;
}(window));

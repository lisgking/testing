(function(window){
	var location=window.location,
		document=window.document,
		rURI=/^((https?:|file:)\/\/(([^:\/]+)(:\d+)?))([^?#]*)([^#]*)(.*)$/;
	var api={
		toSearchObject:function(search){
			var params={};
			this.toSearchArray(search).forEach(function(param){
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
			var a=document.createElement("a"),uri;
			a.href=href,uri=a.href;
			if(href==""){uri=uri.substr(0,uri.lastIndexOf("/")+1);}
			return uri;
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
	};
}(window));
/**
 * SearchString parser
 * Description: java jsp request like parameter API
 * Author: Fuwei Chin
 * Date: Thu, 24 Oct 2013 01:41:09 GMT
 */
(function(window){
	var location=window.location,params={};
	location.search.substr(1).split("&").forEach(function(slice,index){
		if(!slice){return;}
		var eq=slice.indexOf("="),name,value;
		if(eq<0){eq=slice.length;}
		name=decodeURIComponent(slice.substr(0,eq));
		value=decodeURIComponent(slice.substr(eq+1));
		if(!params.hasOwnProperty(name)){params[name]=new Array();}
		params[name].push(value);
	});
	location.getParameter=function(name){return params.hasOwnProperty(name)?params[name][0]:null;};
	location.getParameterValues=function(name){return params.hasOwnProperty(name)?params[name]:[];};
	location.getParameterNames=function(){return Object.keys(params);};
	location.getParameterMap=function(){return params;};
})(window);
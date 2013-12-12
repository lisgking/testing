
//--------------------------------------------------------------------------
// v8 features
//--------------------------------------------------------------------------
var DONT_ENUM=4;
function InstallFunctions(target,desc,source){
	if(source instanceof Array){
		var l=source.length,i;
		for(i=0;i<l;i+=2){
			target[source[i]]=source[i+1];
		}
	}
}
function IS_NATIVE_FUNCTION(fn){
	return fn instanceof Function?fn.toString().indexOf("[native code]")>0:false;
}
function IS_NULL_OR_UNDEFINED(x){
	return x===null||x===undefined;
}
function TO_INT32(x){
	return x>>0;
}
function TO_UINT32(x){
	return x>>>0;
}

//--------------------------------------------------------------------------
// [lte IE 9] setTimeout/setInterval listener parameter support polyfill
//--------------------------------------------------------------------------
if(window.document.documentMode<10&&IS_NATIVE_FUNCTION(setTimeout))(function(fix,win){
	win.setTimeout=fix(win.setTimeout0=win.setTimeout);
	win.setInterval=fix(win.setInterval0=win.setInterval);
}(function(nativeFn){
	return function(listener,delay){
		if(typeof listener=="function"){
			var args=Array.prototype.slice.call(arguments,2);
			nativeFn.call(this,function(){
				listener.apply(this,args)
			},delay);
		}else{
			nativeFn.apply(this,arguments);
		}
	};
},window));
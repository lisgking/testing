/**
 * ECMAScript/DOM polyfill
 * Description: A polyfill for middle-old browsers
 * Author: Fuwei Chin
 * Date: Sun, 27 Oct 2013 09:06:00 GMT
 */

(function(window){
	var document=window.document;
	//~~~~~~~~~~FF~~~~~~~~~~
	if(!("innerText" in document.documentElement)&&"".__defineSetter__)(function(){
		HTMLDocument.prototype.__defineSetter__("innerText",function(text){
			this.textContent=text;
		});
		HTMLDocument.prototype.__defineGetter__("innerText",function(){
			var r=this.ownerDocument.createRange();
			r.selectNodeContents(this);
			return r.toString();
		});
	}());
	//~~~~~~~~~~lt IE 10~~~~~~~~~~
	if(document.documentMode<10)(function(fix,win){
		win.setTimeout=fix(win.setTimeout0=win.setTimeout);
		win.setInterval=fix(win.setInterval0=win.setInterval);
	}(function(fn){
		return function(callback,delay){
			var args=Array.prototype.slice.call(arguments,2);
			if(typeof callback=="function"){
				fn.call(this,function(){callback.apply(this,args)},delay);
			}else{
				fn.apply(this,arguments);
			}
		};
	},window));
}(window));

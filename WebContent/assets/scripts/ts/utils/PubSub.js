(function(global) {
	"use strict";
	var events={},sep=".";
	function publish(event) {
		if(!events.hasOwnProperty(event)){return;}
		var listeners=events[event.type],l=listeners.length,i,
			invoke=function(i){listeners[i].call(this,event);};
		for(i=0;i<l;i++){
			setTimeout(invoke,0,i);
		}
	}
	function subscribe(type,listener) {
		if(!events.hasOwnProperty(type)){events[type]=[];}
		var listeners=events[type];
		if(listeners.indexOf(listener)==-1){
			listeners.push(listener);
		}
	}
	function unsubscribe(event,listener) {
		if(!events.hasOwnProperty(event)){return;}
		var listeners=events[event].index;
		if(listener){
			index=listeners.indexOf(listener);
			if(index!=-1){
				listeners.splice(i,1);
			}
		}else{
			listeners.splice(0,listeners.length);
		}
	}
	global.publish=publish;
	global.subscribe=subscribe;
	global.unsubscribe=unsubscribe;
})(window);
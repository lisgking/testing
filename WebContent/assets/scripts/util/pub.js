/**
 * Publish/Subscribe by Fuwei Chin
 */
//*/
(function(window) {
	"use strict";
	//--------------------------------------------------------------------------
	// [lte IE 9] setTimeout/setInterval callback parameter support
	//--------------------------------------------------------------------------
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
	//--------------------------------------------------------------------------
	// ES6 features
	//--------------------------------------------------------------------------
	function assign(target,source){
		if(target instanceof Object&&source instanceof Object){
			var key;
			for(key in source){
				if(source.hasOwnProperty(key)){target[key]=source[key];}
			}
		}
		return target;
	}
	InstallFunctions(Object,DONT_ENUM,[
		"assign",assign
	]);
	//--------------------------------------------------------------------------
	// EventPhase
	//--------------------------------------------------------------------------
	function EventPhase(){
		
	}
	EventPhase.CAPTURING_PHASE=1;
	EventPhase.AT_TARGET=2;
	EventPhase.BUBBLING_PHASE=3;
	//--------------------------------------------------------------------------
	// PubEvent
	//--------------------------------------------------------------------------
	function PubEvent(type,bubbles){
		this.bubbles=Boolean(bubbles);
		this.eventPhase=EventPhase.AT_TARGET;
		this.target=null;
		this.timeStamp=Date.now();
		this.type=String(type);
	}
	function PubEventClone(){
		var copy=new this.constructor(this.type);
		assign(copy,this);
		return copy;
	}
	InstallFunctions(PubEvent.prototype,DONT_ENUM,[
		"clone",PubEventClone
	]);
	//--------------------------------------------------------------------------
	// EventDispatcher
	//--------------------------------------------------------------------------
	function EventDispatcher(){
		this.events={};
		this.eventSeparator=".";
	}
	function dispatchEvent(event){
		var events=this.events,type=event.type;
		if(!events.hasOwnProperty(type)){return;}
		var listeners=events[type],l=listeners.length,i;
		function invoke(i){listeners[i].call(this,event);};
		for(i=0;i<l;i++){setTimeout(invoke,0,i);}
		if(event.bubbles&&event.eventPhase===EventPhase.AT_TARGET){
			var sep=this.eventSeparator,lastIndex,superType=type,superEvent;
			while((lastIndex=superType.lastIndexOf(sep))!=-1){
				superType=superType.substring(0,lastIndex);
				superEvent=event.clone();
				superEvent.type=superType;
				superEvent.eventPhase=EventPhase.BUBBLING_PHASE;
				dispatchEvent.call(this,superEvent);
			}
		}
	}
	function addEventListener(type,listener){
		var events=this.events;
		if(!events.hasOwnProperty(type)){events[type]=[];}
		var listeners=events[type];
		if(listeners.indexOf(listener)==-1){
			events[type].push(listener);
		}
	}
	function removeEventListener(type,listener){
		var events=this.events;
		if(!events.hasOwnProperty(type)){return;}
		if(listener){
			var listeners=events[type],index;
			if((index=listeners.indexOf(listener))!=-1){
				listeners.splice(index,1);
			}
		}else{
			delete events[type];
		}
	}
	function hasEventListener(type){
		var events=this.events;
		return events.hasOwnProperty(type)&&events[type].length>0;
	}
	function willTrigger(type){
		if(this.hasEventListener(type)){return true;}
		var sep=this.eventSeparator,lastIndex,superType=type,superEvent;
		while((lastIndex=superType.lastIndexOf(sep))!=-1){
			superType=superType.substring(0,lastIndex);
			if(this.hasEventListener(superType)){
				return true;
			}
		}
		return false;
	}
	InstallFunctions(EventDispatcher.prototype,DONT_ENUM,[
		"dispatchEvent",dispatchEvent,
		"addEventListener",addEventListener,
		"removeEventListener",removeEventListener,
		"hasEventListener",hasEventListener,
		"willTrigger",willTrigger
	]);
	//--------------------------------------------------------------------------
	// exports
	//--------------------------------------------------------------------------
	InstallFunctions(window,DONT_ENUM,[
		"EventPhase",EventPhase,
		"PubEvent",PubEvent,
		"EventDispatcher",EventDispatcher,
		"InstallFunctions",InstallFunctions
	]);
})(window);
//*/
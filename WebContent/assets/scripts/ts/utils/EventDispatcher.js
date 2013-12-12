/**
 * Pub/Sub System by Fuwei Chin
 */
(function(window) {
	"use strict";
	//--------------------------------------------------------------------------
	// Event
	//--------------------------------------------------------------------------
	function Event(type,bubbles,target){
		this.bubbles=Boolean(bubbles);
		this.eventPhase=Event.AT_TARGET;
		this.target=IS_NULL_OR_UNDEFINED(target)?null:target;
		this.timeStamp=Date.now();
		this.type=String(type);
	}
	Event.SEPARATOR=".";
	Event.CAPTURING_PHASE=1;
	Event.AT_TARGET=2;
	Event.BUBBLING_PHASE=3;
	
	InstallFunctions(Event.prototype,DONT_ENUM,[
		"clone",function clone(){
			var source=this,
				target=new this.constructor(this.type,this.bubbles,this.target);
			target.timeStamp=this.timeStamp;
			target.eventPhase=this.eventPhase;
			return target;
		}
	]);
	//--------------------------------------------------------------------------
	// EventDispatcher
	//--------------------------------------------------------------------------
	function EventDispatcher(){
		this.events={};
	}
	function dispatchEvent(event){
		var events=this.events,type=event.type;
		if(!events.hasOwnProperty(type)){return;}
		var listeners=events[type],l=listeners.length,i;
		function invoke(i){listeners[i].call(this,event);};
		for(i=0;i<l;i++){setTimeout(invoke,0,i);}
		if(event.bubbles&&event.eventPhase===Event.AT_TARGET){
			var sep=Event.SEPARATOR,lastIndex,superType=type,superEvent;
			while((lastIndex=superType.lastIndexOf(sep))!=-1){
				superType=superType.substring(0,lastIndex);
				superEvent=event.clone();
				superEvent.type=superType;
				superEvent.eventPhase=Event.BUBBLING_PHASE;
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
		var listeners=events[type],index;
		if(listener){
			index=listeners.indexOf(listener);
			if(index!=-1){
				listeners.splice(index,1);
			}
		}else{
			listeners.splice(0,listeners.length);
		}
	}
	function hasEventListener(type){
		var events=this.events,listeners=events[type];
		return events.hasOwnProperty(type)&&listeners.length>0;
	}
	function willTrigger(type){
		if(this.hasEventListener(type)){return true;}
		var sep=Event.SEPARATOR,lastIndex,superType=type,superEvent;
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
		"removeEventListener",removeEventListener/*,
		"hasEventListener",hasEventListener,
		"willTrigger",willTrigger*/
	]);
	InstallFunctions(EventDispatcher.prototype,DONT_ENUM,[
		"publish",dispatchEvent,
		"subscribe",addEventListener,
		"unsubscribe",removeEventListener
	]);
	//--------------------------------------------------------------------------
	// exports
	//--------------------------------------------------------------------------
	InstallFunctions(window,DONT_ENUM,[
		"TSEvent",Event,
		"TSEventDispatcher",EventDispatcher
	]);
})(window);

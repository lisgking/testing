/**
 * Custom System System
 */
(function(window) {
	window.subscribe=addEventListener;
	window.subscribe=removeEventListener;
	window.publish=dispatchEvent;
	if(!window.CustomEvent2){
		function CustomEvent(type,params){
			if(!(this instanceof CustomEvent)){
				throw new TypeError("DOM object constructor cannot be called as a function.");
			}
			this.detail=params?params.detail:undefined;
		}
		CustomEvent.prototype=Event.prototype;
		window.CustomEvent2=CustomEvent;
	}
})(window);

(function(d) {
	var cache= {};
	function publish(topic,args){
		if(!args){args=[];}
		if(cache.hasOwnProperty(topic)) {
			function apply(callback){callback.apply(d,args);}
			cache[topic].forEach(function(callback){
				setTimeout(apply,0,callback);
			});
		}
	};
	function subscribe(topic,callback){
		if(!(callback instanceof Function)){
			throw new TypeError("callback must be a callable function");
		}
		var callbacks=cache[topic];
		if(!cache.hasOwnProperty(topic)) {
			cache[topic]=callbacks=[];
		}
		callbacks.push(callback);
	};
	function unsubscribe(topic,callback){
		if(!cache.hasOwnProperty(topic)){return;}
		var callbacks=cache[topic],index;
		if(callback instanceof Function&&(index=callbacks.indexOf(callback))!=-1){
			callbacks.splice(index,1);
		}else{
			callbacks.splice(0,callbacks.length);
		}
	};
	d.publish=publish;
	d.subscribe=subscribe;
	d.unsubscribe=unsubscribe;
})(window);
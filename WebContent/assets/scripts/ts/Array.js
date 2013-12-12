//--------------------------------------------------------------------------
// Array
//--------------------------------------------------------------------------
InstallFunctions(Array.prototype,DONT_ENUM,[
	/**
	 * convinient edition of Array#filter
	 * where(props:Object[, useExpAndFun:Boolean=false]):Array
	 * examples:
	 *      //select * from customers where firstName='Bella' and lastName like 'D%' and age<40
	 *      customers.where({
	 *          firstName:"Bella",lastName:/^D/,age:function(){return age<40;}
	 *      },true);
	 *      //This a querySelector edition of querySelectorAll
	 *      customers.where({
	 *          firstName:"Bella",lastName:"Davis"
	 *      });
	 */
	"where",function where(props,useExpAndFun){
		if(!(props instanceof Object)){return [];}
		var items=Array.prototype.slice.call(this),
			result=[],
			keys=Object.keys(props),
			l=items.length,
			matcher=useExpAndFun?
			function(key){
				var item=this,val=props[key];
				if(val instanceof Function){
					return val.call(item,item[key],key)===true;
				}else if(key in item){
					if(val instanceof RegExp){
						return val.test(item[key]);
					}else{
						return item[key]===val;
					}
				}
				return false;
			}:
			function(key){return this[key]===props[key];};
		for(i=0;i<l;i++){
			if(keys.every(matcher,items[i])){
				result.push(items[i]);
			}
		}
		return result;
	},
	/**
	 * where(props:Object[, useExpAndFun:Boolean=false]):Object
	 */
	"findWhere",function findWhere(props,useExpAndFun){
		if(!(props instanceof Object)){return undefined;}
		var items=Array.prototype.slice.call(this),
			keys=Object.keys(props),
			l=items.length,
			matcher=useExpAndFun?
			function(key){
				var item=this,val=props[key];
				if(val instanceof Function){
					return val.call(item,item[key],key)===true;
				}else if(key in item){
					if(val instanceof RegExp){
						return val.test(item[key]);
					}else{
						return item[key]===val;
					}
				}
				return false;
			}:
			function(key){return this[key]===props[key];};
		if(keys.length>0){
			for(i=0;i<l;i++){
				if(keys.every(matcher,items[i])){
					return items[i];
				}
			}
		}
		return undefined;
	},
	/**
	 * sortOn(field:String [,field2:String, [...]]):Array
	 */
	"sortOn",function sortOn(){
		var fields=arguments,result=Array.prototype.slice.call(this);
		if(fields.length==0){return result.sort();}
		var sorter=function(a,b) {
			var i=0,f=fields[i];
			while(a[f]==b[f]&&i<fields.length){
				f=fields[i++];
			}
			return a[f]>b[f]?1:a[f]==b[f]?0:-1;
		};
		return result.sort(sorter);
	},
	/**
	 * sortBy(field:String):Array
	 * sortBy(fields:Array):Array
	 * sortBy(byFunction:Function[, scope:Object=null]):Array
	 */
	"sortBy",function sortBy(field,scope) {
		var items=this,
			slice=Function.prototype.call.bind(Array.prototype.slice);
		if(field instanceof Array){
			var sorter=function(a,b){
				var i=0,f=field[i];
				while(a[f]==b[f]&&i<field.length){f=field[i++];}
				return a[f]>b[f]?1:a[f]==b[f]?0:-1;
			},
			result=field.length>0?slice(items).sort(sorter):slice(items).sort();
			return result;
		}else{
			var lookup=function(field){return function(item){return item[field];};},
				byFunction=field instanceof Function?field:lookup(field),
				by="by",
				indexor=function(item,index){return {"by":byFunction.call(scope,item,index,items),"index":index};},
				sorter=function(a,b){return a[by]>b[by]?1:a[by]<b[by]?-1:0;},
				deindexor=function(obj){return items[obj["index"]];},
				result=slice(items).map(indexor).sort(sorter).map(deindexor);
			return result
		}
		return result;
	},
	/**
	 * groupBy(field:String):Object
	 * sortBy(byFunction:Function[, scope:Object=null]):Object
	 */
	"groupBy", function groupBy(field,scope){
		var byFunction=field instanceof Function?field:(function(field){
			return function(item){return item[field];};
		}(field));
		var items=this,length=this.length,result={},i,item,key;
		for(i=0;i<length;i++){
			item=items[i];
			key=byFunction.call(scope,item,i,items);
			if(!result.hasOwnProperty(key)){
				result[key]=[];
			}
			result[key].push(item);
		}
		return result;
	},
	/**
	 * Return first item which contains max value at the specific field
	 * max(field:String):Number
	 * max(valueFunction:Function[, scope:Object]):Number
	 */
	"max",function max(){
		var items=this,max=-Infinity,l=this.length,i;
		for(i=0;i<l;i++){
			if(items[i]>max){
				max=items[i];
			}
		}
		return max;
	},
	"min",function min(){
		var items=this,min=Infinity,l=this.length,i;
		for(i=0;i<l;i++){
			if(items[i]<min){
				min=items[i];
			}
		}
		return min;
	},
	"fragments",function fragments(size){
		var flength=size>>>0;
		var slice=(this.slice instanceof Function)?this.slice:Array.prototype.slice;
		if(flength<=0){
			return slice.call(this);
		}
		var items=this,tlength=items.length,result=[],rlength=Math.ceil(tlength/flength);
		for(i=0;i<rlength;i++){
			result.push(slice.call(items,i*flength,(i+1)*flength));
		}
		return result;
	},
	/**
	 * inverted edition of Array#filter
	 * reject(callback:Function[, scope:Object=null]):Array;
	 */
	"reject",function reject(fn,scope){
		var items=this;l=items.length>>>0,i,result=[];
		for(i=0;i<l;i++){
			if(i in items&&!fn.call(scope,items[i],i,items)){
				result.push(items[i]);
			}
		}
		return result;
	},
	/**
	 * 
	 */
	"mapFilter",function mapFilter(fn,scope){
		var items=this;l=items.length>>>0,i,result=[];
		for(i=0;i<l;i++){
			if(i in items&&fn.call(scope,items[i],i,items)==null){
				result.push(items[i]);
			}
		}
		return result;
	}
]);

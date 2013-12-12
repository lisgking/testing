/**
 * ES6-Draft shim
 */
(function(global) {
	"use strict";
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
		}else if(source instanceof Object){
			for(var key in source){
				if(source.hasOwnProperty(key))target[key]=source[key];
			}
		}
	}
	function defineProperties(object,map) {
		Object.keys(map).forEach(function(name) {
			var method=map[name];
			if( name in object)
				return;
			Object.defineProperty(object,name, {
				configurable:true,
				enumerable:false,
				writable:true,
				value:method
			});
		});
	}
	function ToInt32(x) {
		return x>>0;
	}
	function ToUint32(x) {
		return x>>>0;
	}
	function ToInteger(value) {
		var number=+value;
		if(Number.isNaN(number))
			return 0;
		if(number===0||!Number.isFinite(number))
			return number;
		return Math.sign(number)*Math.floor(Math.abs(number));
	}
	//--------------------------------------------------------------------------
	// String
	//--------------------------------------------------------------------------
	InstallFunctions(String,DONT_ENUM,[
		"fromCodePoint",function fromCodePoint(){
			var points=_slice.call(arguments,0);
			var result=[];
			var next;
			for(var i=0, length=points.length;i<length;i++) {
				next=Number(points[i]);
				if(!Object.is(next,ToInteger(next))||next<0||next>0x10FFFF) {
					throw new RangeError('Invalid code point '+next);
				}
				if(next<0x10000) {
					result.push(String.fromCharCode(next));
				} else {
					next-=0x10000;
					result.push(String.fromCharCode((next>>10)+0xD800));
					result.push(String.fromCharCode((next%0x400)+0xDC00));
				}
			}
			return result.join('');
		},
		"raw",function raw(){
			var callSite=arguments[0];
			var substitutions=_slice.call(arguments,1);
			var cooked=Object(callSite);
			var rawValue=cooked.raw;
			var raw=Object(rawValue);
			var len=Object.keys(raw).length;
			var literalsegments=ToUint32(len);
			if(literalsegments===0) {
				return '';
			}
			var stringElements=[];
			var nextIndex=0;
			var nextKey, next, nextSeg, nextSub;
			while(nextIndex<literalsegments) {
				nextKey=String(nextIndex);
				next=raw[nextKey];
				nextSeg=String(next);
				stringElements.push(nextSeg);
				if(nextIndex+1>=literalsegments) {
					break;
				}
				next=substitutions[nextKey];
				if(next===undefined) {
					break;
				}
				nextSub=String(next);
				stringElements.push(nextSub);
				nextIndex++;
			}
			return stringElements.join('');
		}
	]);
	InstallFunctions(String.prototype,DONT_ENUM,[
		"repeat", (function() {
				var repeat= function(s,times) {
					if(times<1){
						return '';
					}else if(times%2){
						return repeat(s,times-1)+s;
					}else{
						var half=repeat(s,times/2);
						return half+half;
					}
				};
				return function(times) {
					times=ToInteger(times);
					if(times<0||times===Infinity) {
						throw new RangeError();
					}
					return repeat(String(this),times);
				};
			}
		)(),
		"startsWith",function startsWith(str,pos) {
			var len=this.length,start=0;
			if(pos!==undefined){start=Math.min(len,pos|0);}
			return this.slice(start-len,end)===str;
		},
		"endsWith",function endsWith(str,pos){
			var len=this.length,end=len;
			if(pos!==undefined){end=Math.min(len,pos|0);}
			return this.slice(end-str.length,end)===str;
		},
		"contains",function contains(str,pos) {
			return this.indexOf(str,pos)!==-1;
		},
		"codePointAt",function codePointAt(pos) {
			var s=String(this);
			var position=ToInteger(pos);
			var length=s.length;
			if(position<0||position>=length)
				return undefined;
			var first=s.charCodeAt(position);
			var isEnd=(position+1===length);
			if(first<0xD800||first>0xDBFF||isEnd)
				return first;
			var second=s.charCodeAt(position+1);
			if(second<0xDC00||second>0xDFFF)
				return first;
			return ((first-0xD800)*1024)+(second-0xDC00)+0x10000;
		}
	]);
	//--------------------------------------------------------------------------
	// Array
	//--------------------------------------------------------------------------
		
		
	InstallFunctions(Array,DONT_ENUM,[
		"from",function from(iterable) {
			var mapFn=arguments[1];
			var thisArg=arguments[2];
			if(mapFn!==undefined&&_toString.call(mapFn)!=='[object Function]') {
				throw new TypeError('when provided, the second argument must be a function');
			}
			var list=Object(iterable);
			var length=ToUint32(list.length);
			var result= typeof this==='function'?Object(new this(length)):new Array(length);
			for(var i=0;i<length;i++) {
				var value=list[i];
				if(mapFn!==undefined) {
					result[i]= thisArg?mapFn.call(thisArg,value):mapFn(value);
				} else {
					result[i]=value;
				}
			}
			result.length=length;
			return result;
		},
		"of",function of(){
			return Array.from(arguments);
		}
	]);
	function ArrayIterator(array,kind){
		this.i=0;
		this.array=array;
		this.kind=kind;
	}
	InstallFunctions(global,DONT_ENUM,[
		"ArrayIterator",ArrayIterator
	]);
	
	InstallFunctions(ArrayIterator.prototype,DONT_ENUM,[
		"next",function next() {
			var i=this.i;
			this.i=i+1;
			var array=this.array;
			if(i>=array.length) {
				throw new Error();
			}
			if(array.hasOwnProperty(i)) {
				var kind=this.kind;
				var retval;
				if(kind==="key") {
					retval=i;
				}
				if(kind==="value") {
					retval=array[i];
				}
				if(kind==="entry") {
					retval=[i,array[i]];
				}
			} else {
				retval=this.next();
			}
			return retval;
		}
	]);
	InstallFunctions(ArrayIterator.prototype,DONT_ENUM,[
		"copyWithin",function copyWithin(target,start) {
			var o=Object(this);
			var len=Math.max(ToInteger(o.length),0);
			var to=target<0?Math.max(len+target,0):Math.min(target,len);
			var from=start<0?Math.max(len+start,0):Math.min(start,len);
			var end=arguments.length>2?arguments[2]:len;
			var final=end<0?Math.max(len+end,0):Math.min(end,len);
			var count=Math.min(final-from,len-to);
			var direction=1;
			if(from<to&&to<(from+count)) {
				direction=-1;
				from+=count-1;
				to+=count-1;
			}
			while(count>0) {
				if(_hasOwnProperty.call(o,from)) {
					o[to]=o[from];
				} else {
					delete o[from];
				}
				from+=direction;
				to+=direction;
				count-=1;
			}
			return o;
		},
		"fill",function fill(value) {
			var len=this.length;
			var start=arguments.length>1?ToInteger(arguments[1]):0;
			var end=arguments.length>2?ToInteger(arguments[2]):len;
			var relativeStart=start<0?Math.max(len+start,0):Math.min(start,len);
			for(var i=relativeStart;i<len&&i<end;++i) {
				this[i]=value;
			}
			return this;
		},
		"find",function find(predicate) {
			var list=Object(this);
			var length=ToUint32(list.length);
			if(length===0)
				return undefined;
			if( typeof predicate!=='function') {
				throw new TypeError('Array#find: predicate must be a function');
			}
			var thisArg=arguments[1];
			for(var i=0, value;i<length&& i in list;i++) {
				value=list[i];
				if(predicate.call(thisArg,value,i,list))
					return value;
			}
			return undefined;
		},
		"findIndex",function findIndex(predicate) {
			var list=Object(this);
			var length=ToUint32(list.length);
			if(length===0)
				return -1;
			if( typeof predicate!=='function') {
				throw new TypeError('Array#findIndex: predicate must be a function');
			}
			var thisArg=arguments[1];
			for(var i=0, value;i<length&& i in list;i++) {
				value=list[i];
				if(predicate.call(thisArg,value,i,list))
					return i;
			}
			return -1;
		},
		"keys",function keys() {
			return new ArrayIterator(this,"key");
		},
		"values",function values() {
			return new ArrayIterator(this,"value");
		},
		"entries",function entries() {
			return new ArrayIterator(this,"entry");
		},
	]);
	//--------------------------------------------------------------------------
	// Number
	//--------------------------------------------------------------------------
	Number.MAX_SAFE_INTEGER=0x1fffffffffffff;
	Number.MIN_SAFE_INTEGER=-0x1fffffffffffff-1;
	Number.EPSILON=2.220446049250313e-16;
	InstallFunctions(Number,DONT_ENUM,[
		"parseInt",global.parseInt,
		"parseFloat",global.parseFloat,
		"isFinite",function isFinite(){
			return typeof value==="number"&&global.isFinite(value);
		},
		"isSafeInteger",function isSafeInteger(value) {
			return Number.parseInt(value,10)===value&&
				value>=Number.MIN_SAFE_INTEGER&&
				value<=Number.MAX_SAFE_INTEGER;
		},
		"isNaN",function isNaN(value) {
			return value!==value;
		}
	]);
	InstallFunctions(Number.prototype,DONT_ENUM,[
		"clz",function clz() {
			var number=+this;
			if(!number||!Number.isFinite(number))
				return 32;
			number=number<0?Math.ceil(number):Math.floor(number);
			number=number-Math.floor(number/0x100000000)*0x100000000;
			return 32-(number).toString(2).length;
		}
	]);
	//--------------------------------------------------------------------------
	// Object
	//--------------------------------------------------------------------------
	InstallFunctions(Object,DONT_ENUM,[
		"getOwnPropertyDescriptors",function getOwnPropertyDescriptors(subject) {
			var descs= {};
			Object.getOwnPropertyNames(subject).forEach(function(propName) {
				descs[propName]=Object.getOwnPropertyDescriptor(subject,propName);
			});
			return descs;
		},
		"getPropertyDescriptor",function getPropertyDescriptor(subject,name) {
			var pd=Object.getOwnPropertyDescriptor(subject,name);
			var proto=Object.getPrototypeOf(subject);
			while(pd===undefined&&proto!==null) {
				pd=Object.getOwnPropertyDescriptor(proto,name);
				proto=Object.getPrototypeOf(proto);
			}
			return pd;
		},
		"getPropertyNames",function getPropertyNames(subject) {
			var result=Object.getOwnPropertyNames(subject);
			var proto=Object.getPrototypeOf(subject);
			var addProperty= function(property) {
				if(result.indexOf(property)===-1) {
					result.push(property);
				}
			};
			while(proto!==null) {
				Object.getOwnPropertyNames(proto).forEach(addProperty);
				proto=Object.getPrototypeOf(proto);
			}
			return result;
		},
		"assign",function assign(target,source) {
			return Object.keys(source).reduce(function(target,key) {
				target[key]=source[key];
				return target;
			},target);
		},
		"mixin",function mixin(target,source) {
			var props=Object.getOwnPropertyNames(source);
			return props.reduce(function(target,property) {
				var descriptor=Object.getOwnPropertyDescriptor(source,property);
				return Object.defineProperty(target,property,descriptor);
			},target);
		},
		"setPrototypeOf",(function(Object,magic) {
			var set;
			var checkArgs= function(O,proto) {
				if( typeof O!=='object'||O===null) {
					throw new TypeError('cannot set prototype on a non-object');
				}
				if( typeof proto!=='object') {
					throw new TypeError('can only set prototype to an object or null');
				}
			};
			var setPrototypeOf= function(O,proto) {
				checkArgs(O,proto);
				set.call(O,proto);
				return O;
			};
			try {
				// this works already in Firefox and Safari
				set=Object.getOwnPropertyDescriptor(Object.prototype,magic).set;
				set.call({},null);
			} catch (e) {
				if(Object.prototype!=={}[magic]) {
					// IE < 11 cannot be shimmed
					return;
				}
				// probably Chrome or some old Mobile stock browser
				set= function(proto) {
					this[magic]=proto;
				};
				// please note that this will **not** work
				// in those browsers that do not inherit
				// __proto__ by mistake from Object.prototype
				// in these cases we should probably throw an error
				// or at least be informed about the issue
				setPrototypeOf.polyfill=setPrototypeOf(setPrototypeOf({},null),Object.prototype) instanceof Object;
				// setPrototypeOf.polyfill === true means it works as meant
				// setPrototypeOf.polyfill === false means it's not 100% reliable
				// setPrototypeOf.polyfill === undefined
				// or
				// setPrototypeOf.polyfill ==  null means it's not a polyfill
				// which means it works as expected
				// we can even delete Object.prototype.__proto__;
			}
			return setPrototypeOf;
		})(Object,'__proto__'),
		"getOwnPropertyKeys",function getOwnPropertyKeys(subject) {
			return Object.keys(subject);
		},
		"is",function is(a,b){
			if(a===b) {
				// 0 === -0, but they are not identical.
				if(a===0)
					return 1/a===1/b;
				return true;
			}
			return Number.isNaN(a)&&Number.isNaN(b);
		}
	]);
	//--------------------------------------------------------------------------
	// Math
	//--------------------------------------------------------------------------
	InstallFunctions(Math,DONT_ENUM,[
		"acosh",function acosh(value) {
			value=Number(value);
			if(Number.isNaN(value)||value<1)
				return NaN;
			if(value===1)
				return 0;
			if(value===Infinity)
				return value;
			return Math.log(value+Math.sqrt(value*value-1));
		},
		"asinh",function asinh(value) {
			value=Number(value);
			if(value===0||!global_isFinite(value)) {
				return value;
			}
			return Math.log(value+Math.sqrt(value*value+1));
		},
		"atanh",function atanh(value) {
			value=Number(value);
			if(Number.isNaN(value)||value<-1||value>1) {
				return NaN;
			}
			if(value===-1)
				return -Infinity;
			if(value===1)
				return Infinity;
			if(value===0)
				return value;
			return 0.5*Math.log((1+value)/(1-value));
		},
		"cbrt",function cbrt(value) {
			value=Number(value);
			if(value===0)
				return value;
			var negate=value<0, result;
			if(negate)
				value=-value;
			result=Math.pow(value,1/3);
			return negate?-result:result;
		},
		"cosh",function cosh(value) {
			value=Number(value);
			if(value===0)
				return 1;
			// +0 or -0
			if(!global_isFinite(value))
				return value;
			if(value<0)
				value=-value;
			if(value>21)
				return Math.exp(value)/2;
			return (Math.exp(value)+Math.exp(-value))/2;
		},
		"expm1",function expm1(value) {
			value=Number(value);
			if(value===-Infinity)
				return -1;
			if(!global_isFinite(value)||value===0)
				return value;
			var result=0;
			var n=50;
			for(var i=1;i<n;i++) {
				for(var j=2, factorial=1;j<=i;j++) {
					factorial*=j;
				}
				result+=Math.pow(value,i)/factorial;
			}
			return result;
		},
		"hypot",function hypot(x,y) {
			var anyNaN=false;
			var allZero=true;
			var anyInfinity=false;
			var numbers=[];
			Array.prototype.every.call(arguments, function(arg) {
				var num=Number(arg);
				if(Number.isNaN(num))
					anyNaN=true;
				else if(num===Infinity||num===-Infinity)
					anyInfinity=true;
				else if(num!==0)
					allZero=false;
				if(anyInfinity) {
					return false;
				} else if(!anyNaN) {
					numbers.push(Math.abs(num));
				}
				return true;
			});
			if(anyInfinity)
				return Infinity;
			if(anyNaN)
				return NaN;
			if(allZero)
				return 0;
			numbers.sort(function(a,b) {
				return b-a;
			});
			var largest=numbers[0];
			var divided=numbers.map(function(number) {
				return number/largest;
			});
			var sum=divided.reduce(function(sum,number) {
				return sum+=number*number;
			},0);
			return largest*Math.sqrt(sum);
		},
		"log2",function log2(value) {
			return Math.log(value)*Math.LOG2E;
		},
		"log10",function log10(value) {
			return Math.log(value)*Math.LOG10E;
		},
		"log1p",function log1p(value) {
			value=Number(value);
			if(value<-1||Number.isNaN(value))
				return NaN;
			if(value===0||value===Infinity)
				return value;
			if(value===-1)
				return -Infinity;
			var result=0;
			var n=50;
			if(value<0||value>1)
				return Math.log(1+value);
			for(var i=1;i<n;i++) {
				if((i%2)===0) {
					result-=Math.pow(value,i)/i;
				} else {
					result+=Math.pow(value,i)/i;
				}
			}
			return result;
		},
		"sign",function sign(value) {
			var number=+value;
			if(number===0)
				return number;
			if(Number.isNaN(number))
				return number;
			return number<0?-1:1;
		},
		"sinh",function sinh(value) {
			value=Number(value);
			if(!global_isFinite(value)||value===0)
				return value;
			return (Math.exp(value)-Math.exp(-value))/2;
		},
		"tanh",function tanh(value) {
			value=Number(value);
			if(Number.isNaN(value)||value===0)
				return value;
			if(value===Infinity)
				return 1;
			if(value===-Infinity)
				return -1;
			return (Math.exp(value)-Math.exp(-value))/(Math.exp(value)+Math.exp(-value));
		},
		"trunc",function trunc(value) {
			var number=Number(value);
			return number<0?-Math.floor(-number):Math.floor(number);
		},
		"umul",function imul(x,y) {
			// taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
			var ah=(x>>>16)&0xffff;
			var al=x&0xffff;
			var bh=(y>>>16)&0xffff;
			var bl=y&0xffff;
			// the shift by 0 fixes the sign on the high part
			// the final |0 converts the unsigned value into a signed value
			return ((al*bl)+(((ah*bl+al*bh)<<16)>>>0)|0);
		}
	]);
})(window);
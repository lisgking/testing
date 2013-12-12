/**
 * import TSEvent;
 * import TSEventDispatcher;
 */
(function(window,TSEvent,TSEventDispatcher){
	"use strict";
	//--------------------------------------------------------------------------
	// TimerEvent
	//--------------------------------------------------------------------------
	function TimerEvent(type,bubbles,target){
		TSEvent.apply(this,arguments);
		this.type="timer";
	}
	
	TimerEvent.prototype=new TSEvent("timerEvent");
	TimerEvent.prototype.constructor=TimerEvent;
	TimerEvent.TIMER="timer";
	TimerEvent.TIMER_COMPLETE="timerComplete";
	//--------------------------------------------------------------------------
	// Timer
	//--------------------------------------------------------------------------
	function Timer(delay,repeatCount){
		TSEventDispatcher.apply(this,arguments);
		this.delay=delay|0;
		this.repeatCount=arguments.length>=2?Number(repeatCount)|0:Infinity;
		this.currentCount=0;
		this.running=false;
		this.tid=NaN;
	}
	Timer.prototype=new TSEventDispatcher("TimerEventDispatcher");
	InstallFunctions(Timer.prototype,DONT_ENUM,[
		"constructor",Timer,
		"start",function start(){
			var that=this;
			if(that.running||that.currentCount>=that.repeatCount){return;}
			that.running=true;
			function doTimer(){
				if(++that.currentCount>=that.repeatCount){
					that.stop();
					that.currentCount=that.repeatCount;
					return;
				}
				that.dispatchEvent(new TimerEvent(TimerEvent.TIMER));
			}
			that.tid=setInterval(doTimer,that.delay);
		},
		"stop",function stop(){
			var that=this;
			if(!that.running){return;}
			that.running=false;
			clearTimeout(that.tid);
			that.dispatchEvent(new TimerEvent(TimerEvent.TIMER_COMPLETE));
		},
		"reset",function reset(){
			this.stop();
			this.currentCount=0;
		}
	]);
	InstallFunctions(window,DONT_ENUM,[
		"TSTimerEvent",TimerEvent,
		"TSTimer",Timer
	]);
}(window,TSEvent,TSEventDispatcher));
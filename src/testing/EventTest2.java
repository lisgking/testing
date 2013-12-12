package testing;

import com.teamsun.pc.tebe.listeners.VMEvents;
import com.teamsun.pc.tebe.listeners.VMListener;

import flash.events.Event;
import flash.events.EventTarget;
import flash.events.Listener;

public class EventTest2{
	public static void main(String[] args){
		EventTarget vmEvents=new EventTarget();
		vmEvents.addEventListener(VMEvents.OPERATION, Listener.getListener(VMListener.class,"onVmOperation"));
		vmEvents.addEventListener(VMEvents.STATUS_CHANGE, Listener.getListener(VMListener.class,"onVmStatusChanged"));
		vmEvents.addEventListener(VMEvents.STARTED, Listener.getListener(VMListener.class,"onVmStarted"));
		
		Event startedEvent=new Event(VMEvents.STARTED,true);
		
		vmEvents.dispatchEvent(startedEvent);
	}
}

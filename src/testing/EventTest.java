package testing;

import java.util.Date;

import com.teamsun.pc.tebe.listeners.VMEvents;

import flash.events.Event;
import flash.events.EventDispatcher;

public class EventTest{
	public static void main(String[] args){
		EventDispatcher vmEvents=new EventDispatcher();
		vmEvents.addEventListener(VMEvents.OPERATION, null);
		vmEvents.addEventListener(VMEvents.STATUS_CHANGE, null);
		vmEvents.addEventListener(VMEvents.STARTING, null);
		vmEvents.addEventListener(VMEvents.STARTING, null);
		vmEvents.addEventListener(VMEvents.STARTING, null);
		vmEvents.addEventListener(VMEvents.STARTED, null);
		vmEvents.addEventListener(VMEvents.STOPPED, null);
		vmEvents.addEventListener(VMEvents.MODIFIED, null);
		vmEvents.addEventListener(VMEvents.IP_MODIFIED, null);
		vmEvents.addEventListener(VMEvents.STORAGE_MODIFIED, null);
		
		Event startingEvent=new Event(VMEvents.STARTING,true,new Date());
		vmEvents.dispatchEvent(startingEvent);
	}
}

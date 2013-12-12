/**
 * import TSEvent; 
 */
(function(window,TSEvent){
	"use strict";
	//--------------------------------------------------------------------------
	// TimerEvent
	//--------------------------------------------------------------------------
	function VMEvent(type,bubbles,target){
		TSEvent.apply(this,arguments);
	}
	
	VMEvent.prototype=new TSEvent("vmEvent");
	VMEvent.prototype.constructor=VMEvent;
	
	VMEvent.OPERATION="vm";
	VMEvent.CREATE_DELETE="vm.createdelete";
	VMEvent.STATUS_CHANGE="vm.statuschange";
	
	VMEvent.CREATING="vm.createdelete.creating";
	VMEvent.CREATED="vm.createdelete.creating";
	VMEvent.DELETING="vm.createdelete.deleting";
	VMEvent.DELETED="vm.createdelete.deleted";
	
	VMEvent.STARTING="vm.statuschange.starting";
	VMEvent.STARTED="vm.statuschange.started";
	VMEvent.STOPPING="vm.statuschange.stopping";
	VMEvent.STOPPED="vm.statuschange.stopped";
	VMEvent.MODIFYING="vm.statuschange.modifying";
	VMEvent.MODIFIED="vm.statuschange.modified";
	
	//--------------------------------------------------------------------------
	// exports
	//--------------------------------------------------------------------------
	InstallFunctions(window,DONT_ENUM,[
		"VMEvent",VMEvent
	]);
}(window,TSEvent));
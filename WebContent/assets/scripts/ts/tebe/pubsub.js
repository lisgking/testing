
var vmEvents=new TSEventDispatcher();

function logVMOperation(event){
	console.log("VM operation",event.target.vmName,"at",new Date(event.timeStamp).toUTCString());
}
function vmStatusChanged(event){
	console.log("VM",event.target.vmName,"status changed");
}
function vmStarting(event){
	console.log("VM",event.target.vmName,"is being starting");
}
function updateVMStatusInTree(event){
	console.log("VM",event.target.vmName,"is being starting, resfresh tree");
	throw new Error("trying to break the listener chain");
}
function updateVMStatusInTable(event){
	console.log("VM",event.target.vmName,"is being starting, resfresh table");
}
function vmStarted(event){
	console.log("VM",event.target.vmName,"was started");
}
function vmStopped(event){
	console.log("VM",event.target.vmName,"was stopped");
}
function vmMidified(event){
	console.log("VM",event.target.vmName,"was modified");
}

vmEvents.addEventListener(VMEvent.OPERATION, logVMOperation);
vmEvents.addEventListener(VMEvent.STATUS_CHANGE, vmStatusChanged);

vmEvents.addEventListener(VMEvent.STARTING, vmStarting);
vmEvents.addEventListener(VMEvent.STARTING, updateVMStatusInTree);
vmEvents.addEventListener(VMEvent.STARTING, updateVMStatusInTable);

vmEvents.addEventListener(VMEvent.STARTED, vmStarted);
vmEvents.addEventListener(VMEvent.STOPPED, vmStopped);
vmEvents.addEventListener(VMEvent.MODIFIED, vmMidified);

var startingEvent=new VMEvent(VMEvent.STARTING,true);
startingEvent.target={vmName:"x_fav_server"};
vmEvents.dispatchEvent(startingEvent);

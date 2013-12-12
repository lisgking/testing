
var vmEvents=new EventDispatcher();

function logVMOperation(event){
	console.log("VM operation",event.target.vmName,"at",new Date(event.timeStamp));
}
function vmStatusChanged(event){
	console.log("VM",event.target.vmName,"status changed");
}
function vmStarting(event){
	console.log("VM",event.target.vmName,"is being starting");
}
function updateVMStatusInTree(event){
	console.log("VM",event.target.vmName,"is being starting, resfresh tree");
	throw new Error("trying to break listener chain");
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
function vmIPMidified(event){
	console.log("IP of VM",event.target.vmName,"was modified");
}
function vmStorageMidified(event){
	console.log("Storage of VM",event.target.vmName,"was modified");
}
vmEvents.addEventListener("vm",logVMOperation);
vmEvents.addEventListener("vm.statuschange",vmStatusChanged);
vmEvents.addEventListener("vm.statuschange.starting",vmStarting);
vmEvents.addEventListener("vm.statuschange.starting",updateVMStatusInTree);
vmEvents.addEventListener("vm.statuschange.starting",updateVMStatusInTable);
vmEvents.addEventListener("vm.statuschange.started",vmStarted);
vmEvents.addEventListener("vm.statuschange.stopped",vmStopped);

vmEvents.addEventListener("vm.modified",vmMidified);
vmEvents.addEventListener("vm.modified.ipmodified",vmIPMidified);
vmEvents.addEventListener("vm.modified.storagemidified",vmStorageMidified);

var startingEvent=new PubEvent("vm.statuschange.starting",true);
startingEvent.target={vmName:"x_fav_server"};
vmEvents.dispatchEvent(startingEvent);
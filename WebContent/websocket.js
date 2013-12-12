var websocket;
//发送消息
function send(){
	var message={},input=$("#text");
	var content=input.prop("value").trim();
	if(!content){return;}
	$.extend(message,{
		from:user,
		content:content,
		timestamp:+new Date(),
		type:'message'
	});
	websocket.send(JSON.stringify(message));
	input.prop("value","");
}
function receive(msg){
	var str=msg.from+": "+new Date(msg.timestamp).toTimeString().substr(0,8)+"\n"+msg.content+"\n\n";
	var ta=$("textarea")[0];
	ta.value+=str;
}
function initWebSocket(){
	websocket=new WebSocket(encodeURI('ws://127.0.0.1:8080/testing/message'));
	websocket.onopen=function(){
		console.log(title+'  (已连接)');
	};
	websocket.onerror=function(){
		console.log(title+'  (连接发生错误)');
	};
	websocket.onclose=function(){
		console.log(title+'  (已经断开连接)');
	};
	websocket.onmessage=function(message){
		var message=JSON.parse(message.data);
		console.log(message);
		if(message.type=='message'){
			receive(message);
		}else if(message.type=='get_online_user'){
			
		}else if(message.type=='user_join'){
			
		}else if(message.type=='user_leave'){
			
		}
	};
};
jQuery(function($){
	initWebSocket();
	$("#send").on("click",send);;
});
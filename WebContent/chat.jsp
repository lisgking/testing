<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="com.teamsun.pc.tebe.socket.VMService"%>
<%
	String user = (String) session.getAttribute("user");
	if (user == null) {
		//为用户生成昵称  
		user = "游客" + VMService.ONLINE_USER_COUNT;
		VMService.ONLINE_USER_COUNT++;
		session.setAttribute("user", user);
	}
	pageContext.setAttribute("user", user);
%>
<!DOCTYPE html>
<html lang="en">
<head>
<title>WebSocket Chat Room</title>
<link rel="stylesheet" href="websocket.css" />
<script type="text/javascript">
var user="${user}",title=user;
</script>
<script src="assets/libs/jquery-1.8.2.js"></script>
<script src="websocket.js"></script>
</head>

<body>
	<h1>WebSocket Chat Room</h1>
	<div class="panel">
		<textarea id="textarea" readonly="readonly"></textarea><br />
		<input type="text" id="text" /><br />
		<input type="button" value="Send" id="send" /><br />
	</div>
	<div class="mask"></div>
</body>
</html>

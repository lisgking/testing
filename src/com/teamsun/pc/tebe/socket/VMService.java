package com.teamsun.pc.tebe.socket;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;

import org.apache.catalina.websocket.StreamInbound;
import org.apache.catalina.websocket.WebSocketServlet;

@WebServlet(urlPatterns={"/message"})

public class VMService extends WebSocketServlet {

	private static final long serialVersionUID = 1L;

	public static int ONLINE_USER_COUNT = 1;

	// 跟平常Servlet不同的是，需要实现createWebSocketInbound，在这里初始化自定义的WebSocket连接对象
	@Override
	protected StreamInbound createWebSocketInbound(String subProtocol, HttpServletRequest request){
		return new WebSocketMessageInbound((String) request.getSession().getAttribute("user"));
	}
}
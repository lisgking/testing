package com.teamsun.pc.tebe.socket;

import java.io.IOException;
import java.nio.CharBuffer;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class ConnectionPool{

	private static final Map<String,WebSocketMessageInbound> connections=new HashMap<String,WebSocketMessageInbound>();

	public static void addInbound(WebSocketMessageInbound inbound){
		connections.put(inbound.getUser(),inbound);
	}

	public static void removeInbound(WebSocketMessageInbound inbound){
		connections.remove(inbound.getUser());
	}

	public static Set<String> getOnlineUser(){
		return connections.keySet();
	}

	public static void sendMessage(String message,String user){
		try{
			WebSocketMessageInbound inbound=connections.get(user);
			if(inbound!=null){
				inbound.getWsOutbound().writeTextMessage(CharBuffer.wrap(message));
			}
		}catch(IOException e){
			e.printStackTrace();
		}
	}

	public static void sendMessage(String message){
		try{
			Set<String> keySet=connections.keySet();
			for(String key:keySet){
				WebSocketMessageInbound inbound=connections.get(key);
				if(inbound!=null){
					inbound.getWsOutbound().writeTextMessage(CharBuffer.wrap(message));
				}
			}
		}catch(IOException e){
			e.printStackTrace();
		}
	}
}
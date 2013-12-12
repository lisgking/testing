package com.teamsun.pc.tebe.io;

public class JsonRW{
	public static void main(String[] args){
		String webRoot="D:/workspace2/.metadata/.plugins/org.eclipse.wst.server.core/tmp0/wtpwebapps/testing/";
		String contextPath="assets/_locales/message.json";
		String[] locales=new String[]{"en_US","en_CA"};
		boolean ok=I18nJson.addLocales(webRoot,contextPath,locales);
//		String[] locales=new String[]{"zh_CN","zh_TW"};
//		boolean ok=I18nJson.addLocales(webRoot,contextPath,locales);
		System.out.println("OK? "+ok);
	}
}

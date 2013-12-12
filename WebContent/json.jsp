<%@page import="java.io.IOException"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.io.File"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Map"%>
<%@page import="com.alibaba.fastjson.JSON"%>
<%@page import="com.teamsun.pc.tebe.io.I18nJson"%>
<%@page language="java" contentType="application/json" pageEncoding="UTF-8"%>
<%
	String webRoot=application.getRealPath("/"),
			contextPath=request.getParameter("contextPath");
	//get
	String fetch=request.getParameter("locale");
	if(fetch!=null){
		I18nJson i18n=new I18nJson(fetch,webRoot,contextPath,null);
		if(!new File(i18n.getAbsolutePath()).exists()){
			String msg=new String(("File "+i18n.getAbsolutePath()+" Not Found").getBytes("ISO-8859-1"));
			response.sendError(HttpServletResponse.SC_NOT_FOUND, msg);
			return;
		}
		I18nJson.writeJsonToClient(response,I18nJson.getLocaleJSON(i18n));
		return;
	}
	//set
	String[] locales=request.getParameter("locales").split(",");
	boolean[] result=new boolean[locales.length];
	ArrayList<String> new_locales=new ArrayList<String>();
	ArrayList<String> del_locales=new ArrayList<String>();
	String[] empty_locales=new String[0];
	
	for(int i=0;i<locales.length;i++){
		char c0=locales[i].charAt(0);
		locales[i]=locales[i].substring(1);
		String locale=locales[i],textContent=request.getParameter(locale);
		System.out.println(textContent);
		I18nJson i18n=new I18nJson(locale,webRoot,contextPath,textContent);
		if(c0=='+'){           //create
			result[i]=I18nJson.createNew(i18n);
			if(result[i]){new_locales.add(locale);}
		}else if(c0=='-'){     //delete
			result[i]=true;
			//result[i]=I18nJson.delete(i18n);
			if(result[i]){del_locales.add(locale);}
		}else if(c0=='*'){     //update
			result[i]=I18nJson.update(i18n);
		}else{                 //ignore
			result[i]=true;
		}
	}
	if(new_locales.size()>0){
		I18nJson.addLocales(webRoot,contextPath,new_locales.toArray(empty_locales));
	}
	if(del_locales.size()>0){
		I18nJson.removeLocales(webRoot,contextPath,new_locales.toArray(empty_locales));
	}
	
	out.write(JSON.toJSONString(result,true));
%>
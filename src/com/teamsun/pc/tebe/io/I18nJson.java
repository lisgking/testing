package com.teamsun.pc.tebe.io;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;

public class I18nJson{
	public static byte[] UTF_8_BOM=new byte[]{(byte)0xEF,(byte)0xBB,(byte)0xBF};
	private String locale;
	private String webRoot;
	private String contextPath;
	private String textContent;
	
	public I18nJson(String locale, String webRoot, String contextPath,String textContent){
		this.setLocale(locale);
		this.setWebRoot(webRoot);
		this.setContextPath(contextPath);
		this.setTextContent(textContent);
	}
	public static String getLocaleJSON(I18nJson i18n){
		String source=i18n.getWebRoot()+i18n.getContextPath();
		File file=new File(source);
		String textContent=readFileToString(file);
		i18n.setTextContent(textContent);
		return textContent;
	}
	public static void writeJsonToClient(HttpServletResponse response,String json) throws IOException{
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
	}
	public static boolean createNew(I18nJson i18n){
		return i18n.save();
	}
	public static boolean update(I18nJson i18n){
		return i18n.save();
	}
	public static boolean delete(I18nJson i18n){
		File f=new File(i18n.getAbsolutePath());
		return !f.exists()||f.delete();
	}
	public static String readFileToString(File file){
		BufferedReader br=null;
		try{
			br = new BufferedReader(new FileReader(file));
			StringBuffer sb=new StringBuffer();
			char[] cbuf=new char[65536];
			int count;
			while((count=br.read(cbuf,0,cbuf.length))!=-1){
				sb.append(cbuf,0,count);
			}
			return sb.toString();
		}catch(Exception e) {
			e.printStackTrace();
		}finally{
			try {if(br!=null)br.close();}catch(IOException e){}
		}
		return null;
	}
	public static boolean writeStringToFile(File file,String str){
		BufferedWriter bw=null;
		try{
			bw=new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file),"UTF-8"));
			bw.write(str);
			return true;
		}catch(IOException e){
			e.printStackTrace();
		}finally{
			try {if(bw!=null)bw.close();}catch(IOException e) {}
		}
		return false;
	}
	@SuppressWarnings("unchecked")
	private static boolean updateLocales(String webRoot, String contextPath, String[] locales, int flag){
		String path=webRoot+contextPath.replace("$1/","");
		File bootJson=new File(path);
		try{
			String textContent=readFileToString(bootJson);
			Map<String,Object> root=(Map<String,Object>)JSON.parse(textContent);
			List<String> _locales=(List<String>)root.get("_locales");
			if(flag>0){
				for(String locale:locales){
					if(!_locales.contains(locale)){
						_locales.add(locale);
					}
				}
			}else if(flag<0){
				for(String locale:locales){
					if(_locales.contains(locale)){
						_locales.remove(locale);
					}
				}
			}
			root.put("_locales",_locales);
			textContent=JSON.toJSONString(root,SerializerFeature.PrettyFormat);
			return writeStringToFile(bootJson,textContent);
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}
	public static boolean addLocales(String webRoot, String contextPath, String[] locales){
		return updateLocales(webRoot,contextPath,locales,1);
	}
	public static boolean removeLocales(String webRoot, String contextPath, String[] locales){
		return updateLocales(webRoot,contextPath,locales,-1);
	}
	public String getLocale(){
		return locale;
	}
	public void setLocale(String locale){
		this.locale=locale;
	}
	public String getWebRoot(){
		return webRoot;
	}
	public void setWebRoot(String webRoot){
		this.webRoot=webRoot;
	}
	public String getContextPath(){
		return contextPath;
	}
	public void setContextPath(String contextPath){
		this.contextPath=contextPath.replace("$1",locale);
	}
	public String getTextContent(){
		return textContent;
	}
	public void setTextContent(String textContent){
		this.textContent=textContent;
	}
	public String getAbsolutePath(){
		return webRoot+contextPath;
	}
	public boolean save(){
		try{
			File file=new File(getAbsolutePath()),dir=file.getParentFile();
			if(!dir.exists()){
				dir.mkdir();
			}
			if(!file.exists()){
				file.createNewFile();
			}
			BufferedWriter bf=new BufferedWriter(new FileWriter(file));
			bf.write(textContent);
			bf.close();
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public String toString(){
		return locale+" "+webRoot+contextPath+" "+textContent+"";
	}
}

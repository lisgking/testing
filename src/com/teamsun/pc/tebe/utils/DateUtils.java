package com.teamsun.pc.tebe.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtils {
	private static final SimpleDateFormat GMT_FMT=new SimpleDateFormat("E, dd MMM yyyy HH:mm:ss z",new java.util.Locale("en", "GB"));
	private static final SimpleDateFormat PD_FMT=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	static{
		GMT_FMT.setTimeZone(new java.util.SimpleTimeZone(0, "GMT"));
	}
	public static void main(String[] args) {
		System.out.println(toUpTimeString(100000));
	}
	
	public static String toUpTimeString(int min){
		int hours=(int)Math.floor(min/60.0),
			days=(int)Math.floor(min/1440.0),
			months=(int)Math.floor(min/43200.0);
		int mi=min%60,
			HH=hours%24,
			dd=days%30,
			MM=months;
		StringBuilder sb=new StringBuilder();
		if(MM>0){
			sb.append(MM).append("mon,")
				.append(dd).append("d");
		}else if(dd>0){
			sb.append(dd).append("d,")
				.append(HH).append("h");
		}else if(HH>0){
			sb.append(HH).append("h,")
				.append(mi).append("min");
		}else{
			sb.append(mi).append("min");
		}
		return sb.toString();
	}
	
	public static String toGMTString(Date date) {
		return GMT_FMT.format(date);
	}
	
	public static String toPDString(Date date) {
		return PD_FMT.format(date);
	}
}

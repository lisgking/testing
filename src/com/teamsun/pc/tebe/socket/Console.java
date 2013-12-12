package com.teamsun.pc.tebe.socket;

public class Console {
	public static void main(String[] args) {
		log(1,2,"三");
	}
	public static String join(Object[] a,String d){
		if (a == null)
			return "";
		int iMax = a.length - 1;
		if (iMax == -1)
			return "";
		StringBuilder b = new StringBuilder();
		for (int i = 0;; i++) {
			b.append(String.valueOf(a[i]));
			if (i == iMax)
				return b.toString();
			b.append(d);
		}
	}
	public static void log(Object... args){
		System.out.println(join(args," "));
	}
}

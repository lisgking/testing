package testing;

import java.util.ArrayList;
import java.util.Locale;

import com.alibaba.fastjson.JSON;

public class I18n {
	public static void main(String[] args) {
		Locale[] locales=Locale.getAvailableLocales();
		//ArrayList<Locale> localeList=new ArrayList<Locale>();
		for(Locale l:locales){
			if(l.toString().length()>4)
			System.out.println("\""+l.toString()+"\":{\"displayLanguage\":\""+l.getDisplayLanguage(l)+"\", \"displayCountry\":\""+l.getDisplayCountry(l)+"\"},");
		}
		
	}
}

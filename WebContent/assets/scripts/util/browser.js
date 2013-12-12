/**
 * UserAgent String Parser
 * Description: A user agent string parser to parse engine, appName, platform and device
 * Author: Fuwei Chin
 * Date: Thu, 24 Oct 2013 04:30:00 GMT
 */
(function(window){
	var r={
		Engine:/(WebKit|Gecko|Trident|Presto|KHTML)\/([\d.]+)/,
		Chrome_Firefox_Konqueror:/(Chrome|Firefox|Konqueror)\/([\d.ab]+)/,
		Safari:/(?:Macintosh|iPhone|iPad|Windows).+Version\/([\d.]+).+(Safari)/,
		MSIE:/(MSIE) ([\d.]+)/,
		Opera:/(Opera).+Version\/([\d.]+)/,
		Windows:/(Windows) NT ([\d.]+)/,
		Macintosh:/(Macintosh).+OS X ([\d._]+)/,
		Unix:/(Linux|X11|BSD|SunOS)()/,
		iOS:/(iPhone|iPad).+ OS ([\d._]+)/,
		Android:/(Android) ([\d.]+).*; (.+) Build/,
		WindowsPhone:/(Windows Phone OS|Windows Phone) ([\d.]+).*; (.+)\)/,
		BlackBerry:/(BlackBerry|BB10).+Version\/([\d.]+)/
	},
	ua=window.navigator.userAgent,
	mapping={
		Linux:"Unix",X11:"Unix",BSD:"Unix",SunOS:"Unix",
		iPhone:"iOS",iPad:"iOS",Android:"Android",
		"Windows Phone":"WindowsPhone","Windows Phone OS":"WindowsPhone",
		BlackBerry:"BlackBerry",BB10:"BlackBerry"
	},
	browser={
		engine: "",engineVersion: "",
		appName: "",appVersion: "",
		platform:"",platformVersion:"",
		mobile:false,device:""
	},m,p;
	if(m=ua.match(r.Engine)){
		browser.engine=m[1],browser.engineVersion=m[2];
		if((m=ua.match(r.Chrome_Firefox_Konqueror)||ua.match(r.MSIE)||ua.match(r.Opera))){
			browser.appName=m[1],browser.appVersion=m[2];
		}else if((m=ua.match(r.Safari))){
			browser.appName=m[2],browser.appVersion=m[1];
		}
	}
	if((m=ua.match(r.Windows)||ua.match(r.Macintosh))){
		browser.platform=m[1],browser.platformVersion=m[2].replace(/_/g,".");
	}else if((m=ua.match(r.iOS)||ua.match(r.Android)||ua.match(r.WindowsPhone)||ua.match(r.BlackBerry))){
		browser.platform=mapping[m[1]],browser.platformVersion=m[2].replace(/_/g,"."),
		browser.mobile=true,p=m[1];
		switch(p){
			case "iPhone":case "iPad":browser.device=p;break;
			case "Android":case "Windows Phone":case "Windows Phone OS":browser.device=m[3];break;
			case "BlackBerry":case "BB10":browser.device=mapping[p];break;
		}
	}else if((m=ua.match(r.Unix))){
		browser.platform=mapping[m[1]],browser.platformVersion=m[2]
	}
	window.navigator.browser=browser;
}(window));
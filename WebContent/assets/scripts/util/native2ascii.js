/**
 * NativeToASCII
 * Description: encode native encoding to UTF-8 based ascii, or as versa
 * Author: Fuwei Chin
 * Date: Thu, 24 Oct 2013 04:30:00 GMT
 */
(function(window){
	var ILLEGAL="Unexpected token ILLEGAL";
	function encodeASCII(str){
		var len=str.length,i,c,c2,cc,ANSI="\\x",UNIC="\\u",BS="\\",ESCAPE="btnvfr\\",buf="",
			rUNIC=/^[0-9a-z]{4}$/i,rASCII=/^[0-9a-z]{2}$/i;
		for(var i=0;i<len;i+=1){
			c=str.charAt(i),cc=c.charCodeAt(0);
			if(cc<32){
				if(cc>=8&&cc<=13){c=BS+ESCAPE.charAt(cc-8);}
				else{c=cc.toString(16),c=ANSI+(c.length<2?"0"+c:c);}
			}else if(cc<128){
				if(cc===92){
					c2=str.charAt(i+1);
					if(c2===""){                          // e.g."ends with\"
						throw new SyntaxError(ILLEGAL);
					}else if(c2==="u"){
						if((c2=str.substr(i+2,4)).length===4&&rUNIC.test(c2)){  // e.g."\u4e00"
							c=BS+"u"+c2,i+=5;
						}else{                            // e.g."\uGHIJ"
							throw new SyntaxError(ILLEGAL);
						}
					}else if(c2==="x"){
						if((c2=str.substr(i+2,2)).length===2&&rASCII.test(c2)){  //e.g."\uc0"
							c=BS+"x"+c2,i+=3;
						}else{                            //e.g."\xGH"
							throw new SyntaxError(ILLEGAL);
						}
					}else if(ESCAPE.indexOf(c2)>-1){      // "\b" "\t" "\n" "\v" "\f" "\r" "\\"
						c=BS+c2,i+=1;
					}else if(c2==="\r"){                  // "\{CR}"
						c="",i+=1;
						if((c2=str.charAt(i+2))==="\n"){i+=1;}  // "\{CR}{LF}"
					}else if(c2==="\n"){                  //"\{LF}"
						c="",i+=1;
					}else{                                //e.g."\a\b\中"
						c="";
					}
				}
			}else if(cc<256){
				c=ANSI+cc.toString(16);
			}else if(cc<4096){
				c=cc.toString(16),c=UNIC+(c.length<4?"0"+c:c);
			}else if(cc<63336){
				c=UNIC+cc.toString(16);
			}
			buf+=c;
		}
		return buf;
	}
	function decodeASCII(str){
		var cc,buf,cmap={b:"\b",t:"\t",n:"\n",v:"\v",f:"\f",r:"\r","\\":"\\"};
		buf=str.replace(/\\(u[0-9a-z]{4}|x[0-9a-z]{2})/g,function(byte,hex){
			var cc=parseInt(hex.substr(1),16);
			if(cc!==cc){throw new SyntaxError(ILLEGAL);}
			return String.fromCharCode(cc);
		}).replace(/\\(.)/g,function(byte,ch){
			return cmap[ch]||ch;
		});
		return buf;
	}
	window.encodeASCII=encodeASCII;
	window.decodeASCII=decodeASCII;
}(window));

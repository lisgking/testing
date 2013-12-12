/**
 * Base64
 * Description: Base64 string encoder and decoder
 * Author: Fuwei Chin
 * Date: Thu, 24 Oct 2013 04:30:00 GMT
 */
(function(window){
	function toBase64(str){
		return btoa(unescape(encodeURIComponent(str)));
	}
	function fromBase64(str){
		return decodeURIComponent(escape(atob(str)));
	}
	String.toBase64=toBase64;
	String.fromBase64=fromBase64;
}(window));
(function($){
	function TabBar(){
		
	}
	iQuery.prototype.tabBar=function(){
		var tabbar=this;
		var target=this.data("provider");
		$("#"+target).children().forEach(function(content){
			content=$(content);
			var label=content.data("label");
			tabbar.append('<li><a href="">'+label+'</a></li>');
		});
	};
}(iQuery));

MusicXMLAnalyzer.HeaderController = function(){

	var that = {},
	view = null,

	init = function(){
		view = MusicXMLAnalyzer.HeaderView();
		view.init();
	};

	that.init = init;

	return that;
};
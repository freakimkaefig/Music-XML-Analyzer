MusicXMLAnalyzer.HeaderController = function(){

	var that = {},

	view = null,

	init = function(){
		console.info('MusicXMLAnalyzer.HeaderController.init');

		view = MusicXMLAnalyzer.HeaderView();
		view.init();
	};

	that.init = init;

	return that;

};
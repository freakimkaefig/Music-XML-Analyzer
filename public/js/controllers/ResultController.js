MusicXMLAnalyzer.ResultController = function(){

	var that = {},

	model = null,
	view = null,

	init = function(){
		console.info('MusicXMLAnalyzer.ResultController.init');

		model = MusicXMLAnalyzer.ResultModel();
		model.init();
		view = MusicXMLAnalyzer.ResultView();
		view.init();

	};

	that.init = init;

	return that;
}
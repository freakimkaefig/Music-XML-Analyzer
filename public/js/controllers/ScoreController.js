/** @constructor */
MusicXMLAnalyzer.ScoreController = function(){

	var that = {},

	view = null,

	init = function() {
		console.info("MusicXMLAnalyzer.ScoreController.init");
		view = MusicXMLAnalyzer.ScoreView();
		view.init();
	};

	that.init = init;

	return that;
}
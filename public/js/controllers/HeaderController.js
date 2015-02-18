MusicXMLAnalyzer.HeaderController = function(){

	var that = {},

	view,

	init = function(headerView){
		console.info('MusicXMLAnalyzer.HeaderController.init');

		view = headerView;
	};

	that.init = init;

	return that;

};
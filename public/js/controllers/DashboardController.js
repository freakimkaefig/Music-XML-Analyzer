MusicXMLAnalyzer.DashboardController = function() {

	var that = {},

	model = null,
	view = null,

	init = function(model, view) {
		console.info('MusicXMLAnalyzer.DashboardController.init');

		that.model = model;
		that.view = view;
	};

	that.init = init;

	return that;
}
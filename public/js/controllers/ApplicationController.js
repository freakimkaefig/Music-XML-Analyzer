MusicXMLAnalyzer.ApplicationController = function() {

	var that = {},
	headerController = null,
	uploadController = null,
	dashboardController = null,
	patternController = null,
	resultController = null,

	/**
	 * Init function of ApplicationController
	 */
	init = function() {
		headerController = MusicXMLAnalyzer.HeaderController();
		headerController.init();
		uploadController = MusicXMLAnalyzer.UploadController();
		uploadController.init();

		if (Route.check('/dashboard')) {
			dashboardController = MusicXMLAnalyzer.DashboardController();
			dashboardController.init();
		}

		if (Route.check('/pattern')) {
			patternController = MusicXMLAnalyzer.PatternController();
			patternController.init();
		}

		if (Route.check('/results')) {
			resultController = MusicXMLAnalyzer.ResultController();
			resultController.init();
		}
	},

	dispose = function() {
		that = {};
	};

	that.init = init;
	that.dispose = dispose;

	return that;
};

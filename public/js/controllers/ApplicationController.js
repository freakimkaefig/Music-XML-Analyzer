MusicXMLAnalyzer.ApplicationController = function() {

	var that = {},

	headerController = null,
	uploadController = null,
	dashboardController = null,
	patternController = null,
	resultController = null,


	init = function() {
		console.info('MusicXMLAnalyzer.ApplicationController.init');

		headerController = MusicXMLAnalyzer.HeaderController();
		headerController.init();

		uploadController = MusicXMLAnalyzer.UploadController();
		uploadController.init();

		if (Route.check('/imprint')) {
			console.info("Detected route '/imprint'");
		}

		if (Route.check('/dashboard')) {
			console.info("Detected route '/dashboard'");
			dashboardController = MusicXMLAnalyzer.DashboardController();
			dashboardController.init();
		}

		if (Route.check('/pattern')) {
			console.info("Detected route '/pattern'");
			patternController = MusicXMLAnalyzer.PatternController();
			patternController.init();
		}

		if (Route.check('/results')) {
			console.info("Detected route '/results'");
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

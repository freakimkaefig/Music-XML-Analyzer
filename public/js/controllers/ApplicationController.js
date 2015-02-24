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
			console.log("Imprint");
		}

		if (Route.check('/dashboard')) {
			dashboardController = MusicXMLAnalyzer.DashboardController();
			dashboardController.init();
		}

		if (Route.check('/pattern')) {
			console.log("Pattern");
			patternController = MusicXMLAnalyzer.PatternController();
			patternController.init();
		}

		if (Route.check('/results/detail\/[0-9]*')) {
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

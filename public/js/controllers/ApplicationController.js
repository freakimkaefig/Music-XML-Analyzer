MusicXMLAnalyzer.ApplicationController = function() {

	var that = {},

	headerView = null,
	headerController = null,

	uploadView = null,
	uploadController = null,

	patternController = null,
	
	dashboardModel = null,
	dashboardView = null,
	dashboardController = null,
	
	patternModel = null,


	init = function() {
		console.info('MusicXMLAnalyzer.ApplicationController.init');

		headerController = MusicXMLAnalyzer.HeaderController();
		headerController.init();

		uploadController = MusicXMLAnalyzer.UploadController();
		uploadController.init();

		if (Route.check('/')) {

		}

		if (Route.check('/search')) {

		}

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
	},
	
	dispose = function() {
		that = {};
	};

	that.init = init;
	that.dispose = dispose;
    
	return that;

};

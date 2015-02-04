MusicXMLAnalyzer.ApplicationController = function() {

	var that = {},

	uploadController = null,

	patternController = null,
	
	dashboardModel = null,
	dashboardView = null,
	dashboardController = null,
	
	patternModel = null,


	init = function() {
		console.info('MusicXMLAnalyzer.ApplicationController.init');

		if (Route.check('/')) {
			uploadController = MusicXMLAnalyzer.UploadController();
			uploadController.init();
		}

		if (Route.check('/search')) {
			uploadController = MusicXMLAnalyzer.UploadController();
			uploadController.init();
		}

		if (Route.check('/imprint')) {
			console.log("Imprint");
		}

		if (Route.check('/dashboard')) {
			dashboardModel = MusicXMLAnalyzer.DashboardModel();
			dashboardModel.init();
			dashboardView = MusicXMLAnalyzer.DashboardView();
			dashboardView.init();
			dashboardController = MusicXMLAnalyzer.DashboardController(dashboardModel, dashboardView);
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

MusicXMLAnalyzer.ApplicationController = function() {

	var that = {},

	uploadView = null,
	uploadController = null,

	patternController = null,
	
	dashboardModel = null,
	dashboardView = null,
	dashboardController = null,
	
	patternModel = null,


	init = function() {
		console.info('MusicXMLAnalyzer.ApplicationController.init');

		uploadView = MusicXMLAnalyzer.UploadView();
		uploadView.init();
		uploadController = MusicXMLAnalyzer.UploadController();
		uploadController.init(uploadView);

		if (Route.check('/')) {

		}

		if (Route.check('/search')) {

		}

		if (Route.check('/imprint')) {
			console.log("Imprint");
		}

		if (Route.check('/dashboard')) {
			dashboardModel = MusicXMLAnalyzer.DashboardModel();
			dashboardModel.init();
			dashboardView = MusicXMLAnalyzer.DashboardView();
			dashboardView.init();
			dashboardController = MusicXMLAnalyzer.DashboardController();
			dashboardController.init(dashboardModel, dashboardView);
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

MusicXMLAnalyzer.ApplicationController = function() {

	var that = {},

	dashboardView = null,
	patternController = null,
	patternModel = null,


	init = function() {
		console.info('MusicXMLAnalyzer.ApplicationController.init');

		if (Route.check('/imprint')) {
			console.log("Imprint");
		}

		if (Route.check('/dashboard')) {
			dashboardView = MusicXMLAnalyzer.DashboardView();
			dashboardView.init();
		}

		if (Route.check('/pattern')) {
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

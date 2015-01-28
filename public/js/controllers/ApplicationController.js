MusicXMLAnalyzer.ApplicationController = function() {

	var that = {},

	uploadController = null,
	patternController = null,
	patternModel = null,

	init = function() {
		console.info('MusicXMLAnalyzer.ApplicationController.init');

		if (Route.check('/')) {
			uploadController = MusicXMLAnalyzer.UploadController();
			uploadController.init();
		}

		if (Route.check('/imprint')) {
			console.log("Imprint");
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

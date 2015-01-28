MusicXMLAnalyzer.ApplicationController = function() {

	var that = {},

	patternController = null,
	patternModel = null,

	init = function() {   
		console.info('MusicXMLAnalyzer.ApplicationController.init');

		patternController = MusicXMLAnalyzer.PatternController();
		patternController.init();

	},
	
	dispose = function() {
		that = {};
	};

	that.init = init;
	that.dispose = dispose;
    
	return that;

};

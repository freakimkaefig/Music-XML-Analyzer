MusicXMLAnalyzer.PatternController = function() {
	var that = {},

	init = function() {
		console.info('MusicXMLAnalyzer.PatternController.init');
	},

	/**
	 * Function to reset the instance of ARTEService
	 */
	dispose = function() {
		that = {};
	};


	that.init = init;
	that.dispose = dispose;

	return that;
}
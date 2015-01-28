MusicXMLAnalyzer.UploadController = function() {
	var that = {},

	init = function() {
		console.info('MusicXMLAnalyzer.UploadController.init');
		// new Dropzone("#dropzone", { /* options */ });
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
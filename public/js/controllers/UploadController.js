MusicXMLAnalyzer.UploadController = function() {

	var that = {},

	init = function() {
		console.info('MusicXMLAnalyzer.UploadController.init');
		
		Dropzone.options.uploadDropzone = {
			// acceptedFiles: '.xml',
			maxFiles: 10,
			queuecomplete: onQueueComplete
		};
		
	},

	onQueueComplete = function() {
		console.warn("READY");
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